const fs = require('fs')
const path = require('path')

function websiteExists(website) {
  let data
  const jsonFilePath = path.join(__dirname, '..', 'info', 'websites.json')

  if (!fs.existsSync(jsonFilePath)) {
    throw new Error('Index file was not found.')
  }

  data = fs.readFileSync(jsonFilePath, { encoding: 'utf-8' })
  data = JSON.parse(data)
  websiteIndex = data.websites.findIndex(
    (websiteObj) => websiteObj.name === website
  )

  if (websiteIndex < 0) {
    return false
  }

  return true
}

function incrementWebsiteLinksNumber(website) {
  let oldData, newData, websiteIndex
  const jsonFilePath = path.join(__dirname, '..', 'info', 'websites.json')

  if (!fs.existsSync(jsonFilePath)) {
    throw new Error('Index file was not found.')
  }

  oldData = fs.readFileSync(jsonFilePath, { encoding: 'utf-8' })
  oldData = JSON.parse(oldData)
  websiteIndex = oldData.websites.findIndex(
    (websiteObj) => websiteObj.name === website
  )

  if (websiteIndex < 0) {
    throw new Error(`"${website}" does not exists inside the index file`)
  }

  newData = { ...oldData }
  newData.websites[websiteIndex].total_links++

  fs.writeFileSync(jsonFilePath, JSON.stringify(newData, null, 2), {
    encoding: 'utf8'
  })
}

function addWebsiteToIndex(website) {
  let oldData, websiteIndex
  const jsonFilePath = path.join(__dirname, '..', 'info', 'websites.json')

  let data = fs.readFileSync(jsonFilePath, { encoding: 'utf8' })
  // if (err) {
  //   throw new Error(
  //     'Something went wrong while trying to read the index file'
  //   )
  // }

  oldData = JSON.parse(data)

  websiteIndex = oldData.websites.findIndex(
    (websiteObj) => websiteObj.name === website
  )

  if (websiteIndex >= 0) {
    throw new Error(`${website} already exists`)
  }

  newWebsite = {
    index: oldData.websites.length,
    name: website,
    total_links: 0
  }

  oldData.websites.push(newWebsite)

  fs.writeFileSync(jsonFilePath, JSON.stringify(oldData, null, 2), {
    encoding: 'utf8'
  })

  return true
}

module.exports = {
  websiteExists,
  addWebsiteToIndex,
  incrementWebsiteLinksNumber
}
