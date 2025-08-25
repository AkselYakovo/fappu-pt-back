const { scrapPrices } = require('../utils/price-scrapper')

const linksWithDownloads = [
  'https://landing.bangbrosnetwork.com/?ats=eyJhIjo1Mjg3LCJjIjoxMzk5OSwibiI6MTMwLCJzIjo2OTMsImUiOjEwNjczLCJwIjoyfQ%3D%3D',
  'https://landing.bangbrosnetwork.com/?ats=eyJhIjo1MjUsImMiOjgwMDUsIm4iOjEzMCwicyI6NjkzLCJlIjoxMDY3MywicCI6Mn0=',
  'https://landing.bangbrosnetwork.com/?ats=eyJhIjo1MTM0LCJjIjoxMzc3NCwibiI6MTMwLCJzIjo2OTMsImUiOjEwNjczLCJwIjoxMX0='
]

const linksWithoutDownloads = [
  ''
]

describe('Scrap prices correctly', () => {
  test('BANGBROS link (w/ Downloads)', async () => {
    const link = links[0]
    const scrappedSet = await scrapPrices(link)
    const expectedSet = [
      {
        type: 'Year',
        duration: '1',
        price: '119.99',
        includesDownloads: true
      },
      {
        type: 'Month',
        duration: '1',
        price: '34.99',
        includesDownloads: true
      },
      {
        type: 'Month',
        duration: '1',
        price: '24.99',
        includesDownloads: false
      },
      {
        type: 'Day',
        duration: '2',
        price: '1.00',
        includesDownloads: false
      }
    ]

    expect(scrappedSet.scrapped_entries).toEqual(expectedSet)
  }, 15000)

  test('BANGBROS link (No Downloads)', async () => {
    const link = links[0]
    const scrappedSet = await scrapPrices(link)
    const expectedSet = [
      {
        type: 'Year',
        duration: '1',
        price: '119.99',
        includesDownloads: true
      },
      {
        type: 'Month',
        duration: '1',
        price: '34.99',
        includesDownloads: true
      },
      {
        type: 'Month',
        duration: '1',
        price: '24.99',
        includesDownloads: false
      },
      {
        type: 'Day',
        duration: '2',
        price: '1.00',
        includesDownloads: false
      }
    ]

    expect(scrappedSet.scrapped_entries).toEqual(expectedSet)
  }, 15000)
})
