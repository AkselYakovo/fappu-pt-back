require('dotenv').config({ quiet: true })
const puppeteer = require('puppeteer')
const { createSet } = require('./set-transform')
const currentDate = new Date(Date.now()).toLocaleDateString('en-US', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit'
})

async function scrapPrices(link) {
  let scrapped_set = [],
    emailScreenExists = false,
    buttonIsDisabled = false,
    thirdNode = null
  const sectionSelector = 'section[aria-live]'
  const emailInputSelector = 'input[type="email"]'
  const submitButtonSelector = 'button[type="submit"]'
  const mockupEmail = 'asd@gmai.co'
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.BROWSER_PATH,
    args: ['--blink-settings=imagesEnabled=false']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 520, height: 720 })
  await page.goto(link)
  // await page.waitForSelector(imagesSelector, { timeout: 7500 })

  const rowSelector = await page.$$eval('div', (divs) => {
    const onlyFours = Array.from(divs).filter(
      (div) => div.childElementCount === 4
    )

    /** if the arrays that contain 4 elements are just a few, then the webpage uses display:grid; */
    if (onlyFours.length < 3) {
      console.log('Website uses grid template')
      return null
    }

    for (let i = 0; i < onlyFours.length; i++) {
      const parent = onlyFours[i]

      /** If the class is repeated among siblings, then it is a row */
      if (parent.classList.value === onlyFours[i + 1].classList.value) {
        return parent.classList.value.split('\u{0020}')[1]
      }
    }
  })

  if (!rowSelector) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    thirdNode = await page.evaluate(() => {
      const magicString = '1 / 3 / 2 / 4'
      const divs = Array.from(document.getElementsByTagName('div'))
      let correctNodeIndex = divs.findIndex(
        (div) => getComputedStyle(div).gridArea === magicString
      )
      const thirdNode = divs[correctNodeIndex]

      const imageSource = thirdNode.querySelector('img').src
      const imageLink = thirdNode.querySelector('a').href
      return { imageSource, imageLink }
    })
  } else {
    thirdNode = await page.$eval('.' + rowSelector, (row) => {
      const imageSource = row.getElementsByTagName('img')[1].src
      const imageLink = row.querySelectorAll('a')[2].href
      return { imageSource, imageLink }
    })
  }

  await page.goto(thirdNode.imageLink)

  /** Check if email screen exists */
  try {
    await page.waitForSelector(emailInputSelector, { timeout: 5000 })
    emailScreenExists = true
  } catch (e) {
    console.log('Email screen DOES NOT exist..')
  }

  if (emailScreenExists) {
    console.log('Email screen DOES exist..')

    try {
      await page.locator(emailInputSelector).fill(mockupEmail)
      await page.locator(submitButtonSelector).click({ delay: 2000 })
    } catch (error) {
      console.log('Failed to pass email screen..')
      buttonIsDisabled = true
      // await browser.close()
      // return false
    }
  }

  if (buttonIsDisabled) {
    console.log('Retrying to pass email screen..')

    try {
      await page.evaluate(() => {
        const btn = document.querySelector('button[type="submit"]')
        btn.removeAttribute('disabled')
      })
      await page.locator(submitButtonSelector).click({ delay: 500 })
    } catch (error) {
      console.log('Failed to pass email screen (second attempt)..')
      await browser.close()
      return false
    }

    console.log('Email screen PASSED successfully..')
  }

  try {
    await page.waitForSelector(sectionSelector, { timeout: 10000 })
    await new Promise((resolve) => setTimeout(resolve, 3250))
    const divs = await page.evaluate(() => {
      const elements = document.querySelectorAll('section[aria-live] div')
      return Array.from(elements).map((div) => div.textContent)
    })

    scrapped_set = createSet(divs)
  } catch (error) {
    console.log(error)
    await browser.close()
    return false
  }

  console.log('Closing instance..\n')

  await browser.close()

  return {
    link,
    promo_image_src: thirdNode.imageSource,
    scrapped_date: currentDate,
    scrapped_entries: scrapped_set
  }
}

module.exports.scrapPrices = scrapPrices
