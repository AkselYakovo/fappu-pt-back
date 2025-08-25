const {
  createTextCollectionFile,
  createJsonCollectionFile,
  createInfoFile
} = require('./utils/file-creation')

async function run() {
  createTextCollectionFile()
  createJsonCollectionFile()
  createInfoFile()
}

run()
