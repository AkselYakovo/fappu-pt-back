const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

function createJsonCollectionFile(website) {
  if (website == '' || !website || typeof website !== 'string') {
    throw new Error('Argument must be a valid String')
  }

  const jsonFilePath = path.join(
    __dirname,
    '..',
    'collections',
    `${website.toUpperCase()}.json`
  )
  const initialData = { links: [] }

  if (fs.existsSync(jsonFilePath)) {
    throw new Error('File already exists: ' + jsonFilePath)
  }

  fs.writeFileSync(jsonFilePath, JSON.stringify(initialData, null, 2), {
    encoding: 'utf8'
  })

  return true
}

function createInfoFile(data) {
  if (!data.title || data.title == '')
    throw new Error('data object must have a valid title set')

  if (!data.code || data.code == '')
    throw new Error('data object must have a valid code set')

  const infoFilePath = path.join(
    __dirname,
    '..',
    'info',
    `${data.title.toUpperCase()}_info.json`
  )
  const initialData = {
    url: data.url || null,
    logo_url: data.url || null,
    title: data.title || null,
    code: data.code || null,
    lowest_annual_price: null,
    lowest_monthly_price: null,
    total_links: null
  }

  if (fs.existsSync(infoFilePath)) {
    return false
  }

  fs.writeFileSync(infoFilePath, JSON.stringify(initialData, null, 2), {
    encoding: 'utf-8'
  })

  return true
}

async function createTextCollectionFile(website) {
  if (website == '' || !website || typeof website !== 'string') {
    throw new Error('Argument must be a valid String')
  }

  console.log('Working on it!')

  const txtFilePath = path.join(
    __dirname,
    '..',
    'txt',
    `${website.toUpperCase()}_links.txt`
  )

  if (!fs.existsSync(txtFilePath)) {
    fs.writeFileSync(txtFilePath, '', { encoding: 'utf8' })
  } else {
    throw new Error(`File ${txtFilePath} already exists...`)
  }

  let nextPageExists = true
  let linksCollection = []
  const url = '' // CHANGE THIS LINK
  const searchboxSelector = 'input[type="search"].input-sm'
  const paginationSelector = 'ul.pagination'
  const nextButtonSelector = 'li#resultsUrl_next'
  const searchResultItems = 'table tr td > a'
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/opt/brave.com/brave/brave',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()

  console.log('Trying to scrap links from: ', url)

  await page.setViewport({ width: 520, height: 480 })
  await page.goto(url)
  await page.waitForSelector(searchboxSelector, { timeout: 10000 })
  await page.locator(searchboxSelector).fill('?ats')

  await new Promise((resolve) => setTimeout(resolve, 500))
  await page.waitForSelector(paginationSelector)
  await page.waitForSelector(nextButtonSelector)
  await page.waitForSelector(searchResultItems)

  let firstPageUrls = await page.$$eval(searchResultItems, (elements) => {
    return elements.map((element) => element.innerText)
  })

  linksCollection = [...firstPageUrls]

  while (nextPageExists) {
    await page.locator(nextButtonSelector + ' > a').click({ delay: 500 })
    await page.waitForSelector(searchResultItems, { timeout: 20000 })
    let currentPageUrls = await page.$$eval(searchResultItems, (elements) => {
      return elements.map((element) => element.innerText)
    })
    nextPageExists = await page.$eval(nextButtonSelector, (element) => {
      if (element.classList.contains('disabled')) return false
      return true
    })
    linksCollection = [...linksCollection, ...currentPageUrls]
  }

  for (let link of linksCollection)
    fs.appendFile(txtFilePath, link + '\n', (err) => {
      if (err) throw new Error(err)
    })

  console.log('Exiting...')

  await browser.close()

  return
}

module.exports = {
  createTextCollectionFile,
  createJsonCollectionFile,
  createInfoFile
}
