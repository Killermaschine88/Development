const { exec } = require("child_process");

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
  return '2'
}

module.exports = { sleep, execShell, count };
