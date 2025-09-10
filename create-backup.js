const { createBackupFile } = require("./utils/file-creation")

const website = process.argv[2]

function run(website) {
  if (!website) {
    console.log('Invalid argument \'website\' passed.')
    return
  }

  createBackupFile(website)
}

run(website)
