const path = require('path')

describe('incrementing of total links tests', () => {
  const website = 'TESTA'
  const jsonFilePath = path.join(__dirname, '..', 'info', 'websites.json')

  it('increments the links number of a given website)', () => {
    const initialData = {
      websites: [
        {
          index: 0,
          name: 'TESTA',
          total_links: 12
        },
        {
          index: 1,
          name: 'TESTB',
          total_links: 8
        },
        {
          index: 2,
          name: 'TESTC',
          total_links: 0
        }
      ]
    }
    const finalData = {
      websites: [
        {
          index: 0,
          name: 'TESTA',
          total_links: 13
        },
        {
          index: 1,
          name: 'TESTB',
          total_links: 8
        },
        {
          index: 2,
          name: 'TESTC',
          total_links: 0
        }
      ]
    }

    // Mocking of fs module
    jest.resetModules()
    jest.mock('fs', () => ({
      ...jest.requireActual('fs'),
      existsSync: jest.fn(() => true),
      readFileSync: jest.fn(() => JSON.stringify(initialData, null, 2)),
      writeFileSync: jest.fn()
    }))

    // Importing of mocked modules
    const fs = require('fs')
    const {
      incrementWebsiteLinksNumber
    } = require('../utils/website-management')

    incrementWebsiteLinksNumber(website)

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      jsonFilePath,
      JSON.stringify(finalData, null, 2),
      { encoding: 'utf8' }
    )
  })

  it('throws when website does not exists', () => {
    jest.resetModules()
    const {
      incrementWebsiteLinksNumber
    } = require('../utils/website-management')

    expect(incrementWebsiteLinksNumber).toThrow()
  })
})

describe('adding a website to the index', () => {
  const jsonFilePath = path.join(__dirname, '..', 'info', 'websites.json')
  const mockedRecords = {
    websites: [
      {
        index: 0,
        name: 'TESTA',
        total_links: 12
      },
      {
        index: 1,
        name: 'TESTB',
        total_links: 8
      }
    ]
  }

  it('adds a new website', () => {
    const website = 'TESTC'
    const finalRecords = {
      websites: [
        ...mockedRecords.websites,
        {
          index: 2,
          name: website,
          total_links: 0
        }
      ]
    }

    // Mocking of fs module
    jest.resetModules()
    jest.mock('fs', () => ({
      ...jest.requireActual('fs'),
      existsSync: jest.fn(() => true),
      readFileSync: jest.fn(() => JSON.stringify(mockedRecords, null, 2)),
      writeFileSync: jest.fn()
    }))

    // Importing mocked modules
    const fs = require('fs')
    const { addWebsiteToIndex } = require('../utils/website-management')

    addWebsiteToIndex(website)

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      jsonFilePath,
      JSON.stringify(finalRecords, null, 2),
      { encoding: 'utf8' }
    )
  })

  it('prevents adding an already existing website', () => {
    const website = 'TESTA'

    // Mocking of fs module
    jest.resetModules()
    jest.mock('fs', () => ({
      ...jest.requireActual('fs'),
      existsSync: jest.fn(() => true),
      readFileSync: jest.fn(() => JSON.stringify(mockedRecords, null, 2)),
      writeFileSync: jest.fn()
    }))

    // Importing mocked modules
    const fs = require('fs')
    const { addWebsiteToIndex } = require('../utils/website-management')

    expect(() => addWebsiteToIndex(website)).toThrow()
  })
})

describe('checking website existence', () => {
  const mockedRecords = {
    websites: [
      {
        index: 0,
        name: 'TESTA',
        total_links: 12
      },
      {
        index: 1,
        name: 'TESTB',
        total_links: 8
      }
    ]
  }

  test('when website already exists', () => {
    const website = 'TESTA'

    // Mocking of fs module
    jest.resetModules()
    jest.mock('fs', () => ({
      ...jest.requireActual('fs'),
      existsSync: jest.fn(() => true),
      readFileSync: jest.fn(() => JSON.stringify(mockedRecords, null, 2))
    }))

    // Importing mocked modules
    const fs = require('fs')
    const { websiteExists } = require('../utils/website-management')

    expect(websiteExists(website)).toBe(true)
  })

  test('when website does not exist', () => {
    const website = 'TESTC'

    // Mocking of fs module
    jest.resetModules()
    jest.mock('fs', () => ({
      ...jest.requireActual('fs'),
      existsSync: jest.fn(() => true),
      readFileSync: jest.fn(() => JSON.stringify(mockedRecords, null, 2))
    }))

    // Importing mocked modules
    const fs = require('fs')
    const { websiteExists } = require('../utils/website-management')

    expect(websiteExists(website)).toBe(false)
  })
})
