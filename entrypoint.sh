#!/bin/sh

cd /figma-export-pdfs-action

npm run export /github/workspace/dist/

chown -R $(ls -ldn /github/workspace/ | awk '{print $3":"$4}') /github/workspace/dist/
