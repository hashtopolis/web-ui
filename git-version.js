/*
 * Creates a Json file with Git Information
 * Json File is saved in the assets folder and used in the footer to show commit name and other useful information
 *
*/

const childProcess = require('child_process');
const { writeFileSync } = require('fs');

const longSHA = childProcess.execSync("git rev-parse HEAD").toString().trim();
const shortSHA = childProcess.execSync("git rev-parse --short HEAD").toString().trim();
const branch = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const commitTime = childProcess.execSync("git log -1 --pretty=format:'%cd'").toString().trim();
const commitMsg = childProcess.execSync("git log -1 --pretty=%B").toString().trim();
const totalCommitCount = childProcess.execSync("git rev-list --count HEAD").toString().trim();

const versionInfo = {
    shortSHA: shortSHA,
    SHA : longSHA,
    branch: branch,
    lastCommitTime: commitTime,
    lastCommitMessage: commitMsg,
    lastCommitNumber: totalCommitCount
}

const versionInfoJson = JSON.stringify(versionInfo, null, 2);

writeFileSync('src/assets/git-version.json', versionInfoJson);
