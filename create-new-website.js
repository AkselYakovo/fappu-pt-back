const prompt = require('prompt')
const {
  createTextCollectionFile,
  createJsonCollectionFile,
  createInfoFile
} = require('./utils/file-creation')

async function run() {
  prompt.start()

  const { web, website_code, url } = await prompt.get({
    properties: {
      web: {
        description: 'Enter the title of the website:',
        pattern: /\w{4,24}/i,
        message: 'Use only letters. No spaces. Max 24 chars',
        required: true
      },
      website_code: {
        description: 'Enter a code for the website (letters only):',
        pattern: /\w{3,6}/i,
        message: 'Use only letter, on spaces. Max 6 chars',
        required: true
      },
      url: {
        description: 'Enter the link to the official page of the website:',
        pattern:
          /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
        message: 'Please provide a valid URL'
      }
    }
  })

  const data = {
    title: web.toUpperCase(),
    code: website_code.toUpperCase(),
    url: url.toLowerCase()
  }

  createTextCollectionFile(data.title)
  createJsonCollectionFile(data.title)
  createInfoFile(data)
}

run()
