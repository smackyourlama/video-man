const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function renderRemotionVideo(videoDataPayload, outputPath) {
    console.log(`[Remotion] Preparing to render video: ${outputPath}`);
    
    // Save the dynamically generated payload to a temporary JSON file so Remotion can read it as props
    const propsPath = path.join(__dirname, 'temp_props.json');
    fs.writeFileSync(propsPath, JSON.stringify({ videoData: videoDataPayload }));

    const remotionDir = path.join(__dirname, 'remotion');
    const indexFilePath = path.join(remotionDir, 'src', 'index.tsx');

    // Calculate total duration in frames based on the provided videoDataPayload.totalDurationSeconds
    const frames = Math.round(videoDataPayload.totalDurationSeconds * 30) - 1;

    try {
        console.log(`[Remotion] Starting CLI render. Expected frames: ${frames}...`);
        
        // Execute the Remotion render command
        // Note: You must have remotion CLI installed locally or globally. We installed it in the remotion/ folder.
        const cliCommand = `npx remotion render ${indexFilePath} Documentary ${outputPath} --props=${propsPath} --frames=0-${frames} --log=info`;
        
        execSync(cliCommand, { cwd: remotionDir, stdio: 'inherit' });
        
        console.log(`[Remotion] Render complete: ${outputPath}`);
        
        // Cleanup temp props
        if(fs.existsSync(propsPath)) fs.unlinkSync(propsPath);
        
        return outputPath;
    } catch (error) {
        console.error(`[Remotion] Render failed: ${error.message}`);
        throw error;
    }
}

module.exports = { renderRemotionVideo };