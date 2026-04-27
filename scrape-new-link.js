require('dotenv').config({ quiet: true })
const readLine = require('readline')
const fs = require('fs')
const path = require('path')
const { scrapePrices } = require('./utils/price-scraper')
const { saveEntryToFile, entryExists } = require('./utils/entry-management')
const { incrementWebsiteLinksNumber } = require('./utils/website-management')
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

    const data = await scrapePrices(line)

    console.log('final scraped prices', data.scraped_entries, '\n')

    if (process.env.MODE === 'APPEND') {
      if (!data.scraped_entries.length) {
        console.log('Empty set detected, avoiding appending..')
        return
      }

      saveEntryToFile(website, data, false)
      incrementWebsiteLinksNumber(website)
    } else if (process.env.MODE === 'READ') {
      console.log(
        'Mode is currently set to READ; Scraped data WILL NOT be stored into file',
        '\n'
      )
    } else {
      console.log('MODE does not have a valid value (APPEND/READ).')
    }
  }
}
