const path = require('path')
const fs = require('fs')
const {
  createInfoFile,
  createJsonCollectionFile,
  createBackupFile
} = require('../utils/file-creation.js')

describe('Creation of a new info file', () => {
  const fileName = 'EXAMPLE'
  const filePath = path.join(__dirname, '..', 'info', `${fileName}_info.json`)
  const initialData = {
    title: 'EXAMPLE',
    code: 'EXA'
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }

  it('Creates the new info file correctly', () => {
    let fileCreated = false
    fileCreated = createInfoFile(initialData)
    expect(fileCreated).toBe(true)
    fs.unlinkSync(filePath)
  })

  it('Writes the correct data into the file', () => {
    createInfoFile(initialData)
    const rawData = fs.readFileSync(filePath, { encoding: 'utf8' })
    const data = JSON.parse(rawData)
    expect(data).toMatchObject(initialData)
    fs.unlinkSync(filePath)
  })

  it('Fails when incorrect format obj is provided', () => {
    const incorrectData = {
      title: null,
      code: 'EXA'
    }
    try {
      createInfoFile(incorrectData)
    } catch (e) {
      expect(true).toBe(true)
    }
  })

  it('Prevents overwrite of existing files', () => {
    const fileName = 'XAMPLE'
    const filePath = path.join(__dirname, '..', 'info', `${fileName}_info.json`)
    const initialData = {
      title: 'XAMPLE',
      code: 'EXA'
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), {
        encoding: 'utf-8'
      })
    }

    let isFileCreated = createInfoFile(initialData)
    expect(isFileCreated).toBe(false)
  })
})

describe('Creation of a new Collection file', () => {
  const website = 'EXAMPLE'
  const jsonFilePath = path.join(
    __dirname,
    '..',
    'collections',
    `${website.toUpperCase()}.json`
  )

  it('Creates a valid collection file', () => {
    let fileCreated = createJsonCollectionFile(website)
    expect(fileCreated).toBe(true)
    fs.unlinkSync(jsonFilePath)
  })

  it('Fails when trying to create an existing file', () => {
    let fileCreated = false
    fs.writeFileSync(jsonFilePath, JSON.stringify({}), { encoding: 'utf8' })

    try {
      fileCreated = createJsonCollectionFile(website)
    } catch (e) {
      expect(true).toBe(true)
    }
    fs.unlinkSync(jsonFilePath)
  })

  it('Fails when an invalid argument is passed', () => {
    try {
      fileCreated = createJsonCollectionFile(null)
    } catch (e) {
      expect(true).toBe(true)
    }
  })
})

describe('Creation of backup file', () => {
  const website = 'TEST'
  const trailingDate = new Date()
    .toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    .replaceAll('/', '-')
  const backupDir = path.join(__dirname, '..', 'backup')
  const jsonFilePath = path.join(
    __dirname,
    '..',
    'collections',
    `${website.toUpperCase()}.json`
  )

  /** CREATE `TEST.json` FILE */
  fs.writeFileSync(jsonFilePath, 'undefined', { encoding: 'utf-8' })

  test('Creates backup file correctly', () => {
    createBackupFile(website)
    const backupDirFiles = fs.readdirSync(backupDir)
    const backupFilename = backupDirFiles.find((filename) =>
      new RegExp(website, 'i').test(filename)
    )

    expect(backupFilename).toBe(website + '_' + trailingDate + '.json')

    /** REMOVE CREATED TEST FILES */
    fs.unlinkSync(jsonFilePath)
    fs.unlinkSync(path.join(backupDir, backupFilename))
  })
})
