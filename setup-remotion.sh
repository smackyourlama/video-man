#!/bin/bash
set -e

echo "Starting VideoMan Production Studio Setup..."

# 2. Setup Remotion Environment
echo "Setting up Remotion environment..."
mkdir -p remotion/src/components remotion/src/styles remotion/public data/timelines data/scenes data/scripts tts
cd remotion
if [ ! -f package.json ]; then
    npm init -y
    npm install remotion @remotion/cli react react-dom
    npm install -D typescript @types/react @types/react-dom
fi
cd ..

# 3. Setup Chatterbox Environment
echo "Setting up Chatterbox TTS environment..."
cd tts
if [ ! -d "chatterbox" ]; then
    git clone https://github.com/resemble-ai/chatterbox.git
fi
cd chatterbox
# pip install -r requirements.txt # (Commented out until virtualenv is confirmed)
cd ../..

echo "Setup complete! Ready for component building."
