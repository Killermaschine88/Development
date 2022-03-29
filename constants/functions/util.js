const { exec } = require("child_process");
const { num } = require('./test.js')

const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

function execShell(str) {
  exec(str, (err, stdout, stderr) => {
    console.log({ err, stdout, stderr });
  });
}

function count() {
  return num
}

module.exports = { sleep, execShell, count };
