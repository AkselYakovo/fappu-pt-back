const fs = require('fs')
const path = require('path')
const { env } = require('process')

const website = process.argv[2].toUpperCase()
// const filePath = path.join(__dirname, 'txt', `${website}_links.txt`)
// const txtFilePath = path.join(__dirname, '../', 'txt', `${website}_links.txt`)
function saveEntryToFile(website, entry, appendToOldEntries) {
  if (website == '' || !website || typeof website !== 'string') {
    throw new Error('Argument must be a valid String')
  }

  let entryIndex
  const jsonFilePath = path.join(
    __dirname,
    '..',
    'collections',
    `${website.toUpperCase()}.json`
  )

  if (!fs.existsSync(jsonFilePath)) {
    createJsonCollectionFile(website)
    return true
  } else {
    entryIndex = entryExists(entry)
  }

  if (!entryIndex) {
    saveNewEntry(entry)
    return true
  }

  if (entryIndex && appendToOldEntries) {
    appendNewSet(entryIndex, entry)
    return true
  }
}

function entryExists(entry) {
  let entries

  const data = fs.readFileSync(jsonFilePath, { encoding: 'utf8' })
  entries = JSON.parse(data)

  for (let i = 0; i < entries.links.length; i++) {
    const currentEntry = entries.links[i]
    if (currentEntry.link === entry) {
      return i
    }
  }

  return false
}

function appendNewSet(entryIndex, newEntry) {
  let entries, entryToBeUpdated, newScrappedSet
  const data = fs.readFileSync(jsonFilePath, { encoding: 'utf8' })
  entries = JSON.parse(data)

  newScrappedSet = {
    scrapped_on: newEntry.scrapped_date,
    scrapped_entries: newEntry.scrapped_entries
  }
  // entryToBeUpdated = entries.links[entryIndex]
  entryToBeUpdated = entries.links.find((item) => item.index === entryIndex)

  currentScrappedSet = entryToBeUpdated.scrap_index
  // console.log(entryToBeUpdated.scrap_index)
  entryToBeUpdated.scrap_index = [newScrappedSet, ...currentScrappedSet]

  fs.writeFileSync(jsonFilePath, JSON.stringify(entries, null, 2), {
    encoding: 'utf8'
  })

  return true
}

function saveNewEntry(entry) {
  let entries, index, newEntry
  const data = fs.readFileSync(jsonFilePath, { encoding: 'utf8' })
  entries = JSON.parse(data)

  index = entries.links.length
  newEntry = {
    index,
    promo_image_src: entry.promo_image_src,
    link: entry.link,
    created_on: entry.scrapped_date,
    scrap_index: [
      {
        scrapped_on: entry.scrapped_date,
        scrapped_entries: [...entry.scrapped_entries]
      }
    ]
  }

  entries.links.push(newEntry)

  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(entries, null, 2), 'utf8')
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = { saveEntryToFile, saveNewEntry, appendNewSet, entryExists }
