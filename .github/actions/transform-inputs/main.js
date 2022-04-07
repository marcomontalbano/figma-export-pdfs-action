const cp = require('child_process');
cp.execSync(`cd ${__dirname}; npm ci`);

const core = require('@actions/core');

const fileKey = core.getInput('fileKey', { required: true });
const page = JSON.parse(core.getInput('page', { required: true }) || '{}');
const selection = JSON.parse(core.getInput('selection', { required: false }) || '[]');

function removeUndefined(value) {
  return value !== undefined
}

core.setOutput('fileKey', fileKey);
core.setOutput(
  'ids',
  selection
    .map(node => node.id)
    .concat(page.id)
    .filter(removeUndefined)
);
