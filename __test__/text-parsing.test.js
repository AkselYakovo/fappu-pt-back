const {
  getInterval,
  checkForDownloads,
  getPrice
} = require('../utils/text-parsing')

describe('Correct parsing of text data (normal)', () => {
  const oneMonthText = '1 Month Membership'
  const oneYearText = '1 Year Membership'
  const downloadText = `12 Month Membership + Downloads, 30 Day Membership + Downloads include Downloads. Access to Downloads expires when Brazzers expires.`
  const priceText = '$27.99 /Month'
  const trialText = '****Limited access 2 day trial period automatically rebills at $39.99 every 30 days until cancelled'
  const weekText = '**7 Day Membership initial charge of $7.00 automatically rebilling at $39.99 every 30 day until cancelled.'

  it('Parses a monthly interval correctly', () => {
    let interval = getInterval(oneMonthText)
    expect(interval).toEqual({ type: 'Month', value: '1' })
  })

  it('Parses a yearly interval correctly', () => {
    let interval = getInterval(oneYearText)
    expect(interval).toEqual({ type: 'Year', value: '1' })
  })

  it('Parses a trial interval correctly', () => {
    let interval = getInterval(trialText)
    expect(interval).toEqual({ type: 'Day', value: '2' })
  })

  it('Parses a week trial interval correctly', () => {
    let interval = getInterval(weekText)
    expect(interval).toEqual({ type: 'Day', value: '7' })
  })

  it('Parses a membership that DOES NOT include downloads correctly', () => {
    let includesDownloads = checkForDownloads(oneYearText)
    expect(includesDownloads).toBe(false)
  })

  it('Parses a membership that includes downloads correctly', () => {
    let includesDownloads = checkForDownloads(downloadText)
    let expectedArray = [{1:'Year'}, {1:'Month'}]
    expect(includesDownloads).toEqual(expectedArray)
  })

  it('Parses the price of a membership correclty', () => {
    let price = getPrice(priceText)
    expect(price).toBe('27.99')
  })
})

describe('Correct parsing of text data (alternative)', () => {
  const oneMonthText = '30 Day Membership'
  const oneYearText = '12 Month Membership'
  const priceText = 'Billed in one payment of $27.99***'

  it('Parses a monthly interval correctly', () => {
    let interval = getInterval(oneMonthText)
    expect(interval).toEqual({ type: 'Day', value: '30' })
  })

  it('Parses a yearly interval correctly', () => {
    let interval = getInterval(oneYearText)
    expect(interval).toEqual({ type: 'Month', value: '12' })
  })

  it('Parses the price of a membership correclty', () => {
    let price = getPrice(priceText)
    expect(price).toBe('27.99')
  })
})
