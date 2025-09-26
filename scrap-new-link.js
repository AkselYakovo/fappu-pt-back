require('dotenv').config()
const readLine = require('readline')
const fs = require('fs')
const path = require('path')
const { scrapPrices } = require('./utils/price-scrapper')
const { saveEntryToFile, entryExists } = require('./utils/entry-management')
const website = process.argv[2].toUpperCase()
const filePath = path.join(__dirname, 'txt', `${website}_links.txt`)

const readInterface = readLine.createInterface({
  input: fs.createReadStream(filePath),
  terminal: false
})

// readInterface.on('line', async (line) => {
//   console.log('Grabbing prices for ', line)
//   await grabPrices(line)
// })

run()

async function run() {
  for await (const line of readInterface) {
    console.log('Grabbing prices for ', line)

    if (entryExists(website, line)) {
      console.log('Link already exists..')
      continue
    }

    const data = await scrapPrices(line)
    // console.log('Entry indexing prevented. (THIS IS A TEST RUN)')
    // console.log('final data:', data);

    console.log('final scrapped prices', data.scrapped_entries, '\n')

    if (process.env.MODE === 'APPEND') {
      if (!data.scrapped_entries.length) {
        console.log('Empty set detected, avoiding appending..')
        return
      }

      saveEntryToFile(website, data, false)
    } else if (process.env.MODE === 'READ') {
      console.log(
        'Mode is currently set to READ; Scrapped data WILL NOT be stored into file',
        '\n'
      )
    } else {
      console.log('MODE does not have a valid value (APPEND/READ).')
    }
  }
}
