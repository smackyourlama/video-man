const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(DATA_DIR, 'scheduler_state.json');

const DEFAULT_STATE = {
  version: 1,
  targetUploads: 1000,
  completedUploads: 0,
  failedUploads: 0,
  currentJob: null,
  nextPublishAt: null,
  publishIntervalMinutes: 60,
  jobs: []
};

function ensureStateFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(DEFAULT_STATE, null, 2));
  }
}

function loadSchedulerState() {
  ensureStateFile();
  const raw = fs.readFileSync(STATE_FILE, 'utf8');
  const parsed = JSON.parse(raw || '{}');
  return {
    ...DEFAULT_STATE,
    ...parsed,
    jobs: Array.isArray(parsed.jobs) ? parsed.jobs : []
  };
}

function saveSchedulerState(state) {
  ensureStateFile();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function updateSchedulerState(mutator) {
  const state = loadSchedulerState();
  const nextState = mutator({ ...state, jobs: [...state.jobs] }) || state;
  saveSchedulerState(nextState);
  return nextState;
}

module.exports = {
  STATE_FILE,
  DEFAULT_STATE,
  loadSchedulerState,
  saveSchedulerState,
  updateSchedulerState,
};
