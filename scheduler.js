require('dotenv').config();
const { processVideoWorkflow } = require('./run');
const { loadSchedulerState, saveSchedulerState } = require('./scheduler_state');
const { hasTopicHistory, getRecentTopics } = require('./history_manager');

const CHANNEL_PROFILES = {
  'Operator Logic': {
    niche: 'breaking down boring businesses, practical acquisitions, smart systems, and the real mechanics of cash flow. It targets laundromats, car washes, storage, service businesses, and other overlooked operations.',
    tone: 'practical, logical, no hype, useful numbers',
    topics: [
      'The Underrated Cash Flow of Laundromats',
      'Automating a Car Wash for Maximum Profit',
      'Deal Structures for Acquiring Local Service Businesses',
      'Operational Efficiency for Small Businesses',
      'How to Buy and Grow a Storage Facility'
    ]
  },
  'NullSignal': {
    niche: 'Dark AI, cybersecurity, surveillance, automation, privacy, tech corruption, and hidden digital power systems.',
    tone: 'dark, investigative, cyberpunk, ominous',
    topics: [
      'The AI Surveillance State is Already Here',
      'Zero-Day Exploits: The Shadow Market',
      'How Tech Giants Profit from Your Privacy',
      'The Dark Side of Automated Systems',
      'Hidden Backdoors in Everyday Tech'
    ]
  },
  'Blackledger': {
    niche: 'Business collapses, corporate exposés, dark finance, financial manipulation, scams, economic power, and money-trail documentaries.',
    tone: 'investigative, gritty, analytical, exposing',
    topics: [
      'The Collapse of the Biggest Crypto Scam',
      'How Wall Street Manipulates Main Street',
      'The Dark Money Behind Corporate Empires',
      'Inside the World of High-Frequency Trading Fraud',
      'The Anatomy of a Billion-Dollar Ponzi Scheme'
    ]
  },
  'Terminalecho': {
    niche: 'Creepy internet mysteries, AI/cybersecurity horror, lost media, strange broadcasts, dark web stories, surveillance horror, and digital mystery documentaries.',
    tone: 'creepy, suspenseful, mysterious, unsettling',
    topics: [
      'The Unexplained Broadcast of 2007',
      'Lost Media: The Dark Web\'s Scariest Video',
      'When AI Predicts Something Terrifying',
      'The Internet Mystery That Remains Unsolved',
      'Digital Ghosts: Creepy Forums that Refuse to Die'
    ]
  }
};

const CHANNEL_NAMES = Object.keys(CHANNEL_PROFILES);
const TARGET_UPLOADS = Number(process.env.VIDEOMAN_TARGET_UPLOADS || 1000);
const PUBLISH_INTERVAL_MINUTES = Number(process.env.VIDEOMAN_PUBLISH_INTERVAL_MINUTES || 60);
const LOOP_DELAY_MS = Number(process.env.VIDEOMAN_LOOP_DELAY_MS || 5000);
const MAX_RETRIES = Number(process.env.VIDEOMAN_MAX_RETRIES || 3);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function selectJobSeed(index) {
  const channelName = CHANNEL_NAMES[index % CHANNEL_NAMES.length];
  const profile = CHANNEL_PROFILES[channelName];
  const topic = profile.topics[Math.floor(index / CHANNEL_NAMES.length) % profile.topics.length];
  return { channelName, profile, topic };
}

function pickUniqueSeed(index) {
  for (let offset = 0; offset < CHANNEL_NAMES.length * 10; offset += 1) {
    const seed = selectJobSeed(index + offset);
    if (!hasTopicHistory(seed.channelName, seed.topic)) return seed;
  }

  const seed = selectJobSeed(index);
  const recentTopics = new Set(getRecentTopics(seed.channelName, 10).map((topic) => String(topic).trim().toLowerCase()));
  const fallbackTopic = `${seed.topic} Part ${index + 1}`;
  if (!recentTopics.has(fallbackTopic.toLowerCase())) {
    return { ...seed, topic: fallbackTopic, duplicateFallback: true };
  }
  return { ...seed, topic: `${seed.topic} Update ${index + 1}`, duplicateFallback: true };
}

function computeNextPublishAt(state) {
  const base = state.nextPublishAt ? new Date(state.nextPublishAt) : new Date();
  if (Number.isNaN(base.getTime())) return new Date(Date.now() + PUBLISH_INTERVAL_MINUTES * 60 * 1000).toISOString();
  const next = state.nextPublishAt ? base : new Date(base.getTime() + PUBLISH_INTERVAL_MINUTES * 60 * 1000);
  return next.toISOString();
}

function reserveJob(state) {
  const jobIndex = state.completedUploads + state.failedUploads;
  const seed = pickUniqueSeed(jobIndex);
  const publishAt = computeNextPublishAt(state);
  const job = {
    id: `job-${jobIndex + 1}`,
    index: jobIndex,
    status: 'processing',
    createdAt: new Date().toISOString(),
    channelName: seed.channelName,
    topic: seed.topic,
    retries: 0,
    duplicateFallback: !!seed.duplicateFallback,
    publishAt,
  };

  if (seed.duplicateFallback) {
    state.duplicateSkips += 1;
  }

  state.currentJob = job;
  state.nextPublishAt = new Date(new Date(publishAt).getTime() + PUBLISH_INTERVAL_MINUTES * 60 * 1000).toISOString();
  state.publishIntervalMinutes = PUBLISH_INTERVAL_MINUTES;
  state.targetUploads = TARGET_UPLOADS;
  state.jobs.push(job);
  saveSchedulerState(state);
  return job;
}

function markJobComplete(state, jobId, result) {
  state.completedUploads += 1;
  state.currentJob = null;
  state.jobs = state.jobs.map((job) => job.id === jobId ? {
    ...job,
    status: 'uploaded',
    completedAt: new Date().toISOString(),
    youtubeUrl: result.youtubeUrl,
    finalVideoPath: result.finalVideoPath,
    title: result.title,
  } : job);
  saveSchedulerState(state);
}

function markJobFailed(state, jobId, error) {
  const failedJob = state.jobs.find((job) => job.id === jobId);
  const retries = (failedJob?.retries || 0) + 1;

  if (failedJob && retries < MAX_RETRIES) {
    state.currentJob = null;
    state.jobs = state.jobs.map((job) => job.id === jobId ? {
      ...job,
      status: 'retrying',
      retries,
      lastError: error.message,
      retryAt: new Date(Date.now() + retries * 60 * 1000).toISOString(),
    } : job);
    saveSchedulerState(state);
    return 'retry';
  }

  state.failedUploads += 1;
  state.currentJob = null;
  state.jobs = state.jobs.map((job) => job.id === jobId ? {
    ...job,
    status: 'failed',
    retries,
    failedAt: new Date().toISOString(),
    error: error.message,
  } : job);
  saveSchedulerState(state);
  return 'failed';
}

async function retryPendingJobs() {
  const state = loadSchedulerState();
  const retryJob = state.jobs.find((job) => job.status === 'retrying');
  if (!retryJob) return null;
  if (retryJob.retryAt && new Date(retryJob.retryAt).getTime() > Date.now()) return null;

  state.currentJob = { ...retryJob, status: 'processing' };
  state.jobs = state.jobs.map((job) => job.id === retryJob.id ? state.currentJob : job);
  saveSchedulerState(state);
  return state.currentJob;
}

async function runSchedulerLoop() {
  console.log(`[Scheduler] Starting continuous upload loop. Target=${TARGET_UPLOADS}, interval=${PUBLISH_INTERVAL_MINUTES}m`);

  while (true) {
    const state = loadSchedulerState();
    if (state.completedUploads >= TARGET_UPLOADS) {
      console.log(`[Scheduler] Target reached (${state.completedUploads}/${TARGET_UPLOADS}). Exiting.`);
      return;
    }

    if (state.currentJob) {
      console.log(`[Scheduler] Resuming from interrupted state by retrying pending slot ${state.currentJob.id}.`);
      state.jobs = state.jobs.filter((job) => job.id !== state.currentJob.id);
      state.currentJob = null;
      saveSchedulerState(state);
    }

    const job = await retryPendingJobs() || reserveJob(loadSchedulerState());
    console.log(`[Scheduler] Processing ${job.id}: ${job.channelName} | ${job.topic} | publishAt=${job.publishAt}`);

    try {
      const profile = CHANNEL_PROFILES[job.channelName];
      const result = await processVideoWorkflow(JSON.stringify({
        topic: job.topic,
        channelName: job.channelName,
        niche: profile.niche,
        tone: profile.tone,
        publishAt: job.publishAt,
        privacyStatus: 'private',
        cleanupAfterUpload: true,
      }));
      markJobComplete(loadSchedulerState(), job.id, result);
      console.log(`[Scheduler] Completed ${job.id}: ${result.youtubeUrl}`);
    } catch (error) {
      const failureMode = markJobFailed(loadSchedulerState(), job.id, error);
      console.error(`[Scheduler] Failed ${job.id} (${failureMode}):`, error.message);
    }

    await sleep(LOOP_DELAY_MS);
  }
}

if (require.main === module) {
  runSchedulerLoop().catch((error) => {
    console.error('[Scheduler] Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  runSchedulerLoop,
  CHANNEL_PROFILES,
};
