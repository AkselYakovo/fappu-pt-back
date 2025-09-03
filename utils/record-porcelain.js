const fs = require('fs')
const path = require('path')

function rewriteFaultyIndexes(website) {
  let numChanges = 0
  const jsonFilePath = path.join(
    __dirname,
    '..',
    'collections',
    `${website}.json`
  )
  const data = fs.readFileSync(jsonFilePath, { encoding: 'utf8' })
  const entries = JSON.parse(data).links

  for (let i = 0; i < entries.length - 1; i++) {
    const currentRecord = entries[i]
    const nextRecord = entries[i + 1]

    if (nextRecord.index !== currentRecord + 1) {
      nextRecord.index = currentRecord.index + 1
      numChanges++
    }
  }

  if (numChanges) {
    console.log('A grand total of', numChanges, 'changes applied...')
    fs.writeFileSync(jsonFilePath, JSON.stringify({ links: entries }, null, 2))
  } else {
    console.log('No changes made...')
  }
}

module.exports = { rewriteFaultyIndexes }
