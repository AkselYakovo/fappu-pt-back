const path = require('path')
const { scrapPrices } = require('./utils/price-scrapper')
const { appendNewSet } = require('./utils/entry-management')
const { readFileSync } = require('fs')
const website = process.argv[2].toUpperCase()
const entryStart = Number.parseInt(process.argv[3])
const entryEnd = process.argv[4] ? Number.parseInt(process.argv[4]) : null
const filePath = path.join(__dirname, 'collections', `${website}.json`)

if ((entryEnd || entryEnd === 0) && entryEnd < entryStart)
  throw new Error('End index cannot be smaller than initial entry index..')

run()

async function run() {
  let entries,
    scrappedSet,
    entriesUpdated = 0,
    entriesToBeUpdated = entryEnd - entryStart + 1
  const data = readFileSync(filePath, { encoding: 'utf-8' })
  if (!data) throw new Error('File not found..')

  entries = JSON.parse(data).links

  if ((entryStart || entryStart === 0) && !entryEnd) {
    console.log(`Scrapping new set for existing entry #${entryStart}..`)

    for (let entry of entries) {
      if (entry.index !== entryStart) continue
      console.log('Scrapping Link: ', entry.link)
      scrappedSet = await scrapPrices(entry.link)
      console.log('New Scrapped Set:', scrappedSet.scrapped_entries)

      // console.log('Set appending prevented..')
      appendNewSet(website, entryStart, scrappedSet)
      break
    }

    if (!scrappedSet.scrapped_entries.length)
      throw new Error(
        `It was not possible to scrap a new set for the given index(${entryStart})`
      )

    return
  }

  for (let i = entryStart; i <= entryEnd; i++) {
    const currentEntry = entries[i]

    if (currentEntry.index !== i) {
      console.log(
        "Error: entry's index does not match its real position inside the file. Skipping process"
      )
      continue
    }

    console.log(
      `Scrapping new set for existing entry #${i} (${entriesUpdated}/${entriesToBeUpdated})`
    )
    console.log(`Link: ${currentEntry.link}`)

    scrappedSet = await scrapPrices(currentEntry.link)
    console.log('New Scrapped Set:', scrappedSet.scrapped_entries)

    if (!scrappedSet.scrapped_entries.length) {
      console.log(
        `It was not possible to scrap a new set for the given index(${entryStart})`
      )
      continue
    }

    // console.log('Set appending prevented..')
    appendNewSet(website, i, scrappedSet)
    entriesUpdated++
  }

  console.log()
  console.log(
    'Process completed. A total of',
    entriesUpdated,
    entriesUpdated > 1 ? 'entries' : 'entry',
    'updated..'
  )
}
