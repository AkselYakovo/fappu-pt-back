const {
  createTextCollectionFile,
  createJsonCollectionFile,
  createInfoFile
} = require('./utils/file-creation')
const website = process.argv[2].toUpperCase()

async function run() {
  createTextCollectionFile()
  createJsonCollectionFile()
  createInfoFile()
  const data = {
    title: website,
    code: website.substring(0, 3)
  }

}

run()
