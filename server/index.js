require('dotenv').config()
const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const port = 3031

app.use(function (req, res, next) {
  res.setHeader('access-control-allow-origin', process.env.FRONT_WEB)
  res.setHeader('access-control-allow-headers', 'Content-Type')
  res.setHeader('access-control-allow-credentials', 'true')
  next()
})

app.use(express.json())

/** POST */
app.post('/login/user', (req, res) => {
  fs.readFile('./collections/users.json', (err, data) => {
    if (err) return res.status(500)
    const { users } = JSON.parse(data)
    const userExists = users.filter(
      (user) =>
        user.username === req.body.user && user.password === req.body.password
    )

    if (userExists.length) {
      const user = userExists[0]
      res.setHeader('Set-Cookie', `userId=${user.user_id}; Path="/"'`)
      // res.setHeader('Location', '/')
      res.status(200)
      res.json(user)
    } else res.status(401)

    setTimeout(() => {
      res.end()
    }, 1500)
  })
})

/** GET */
app.get('/websites', (req, res) => {
  fs.readFile('./info/websites.json', 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 501
      res.end()
      return
    }
    res.json(data)
  })
})

app.get('/website/:id', (req, res) => {
  const filePath = path.join(
    __dirname,
    '..',
    'info',
    `${req.params.id.toUpperCase()}_info.json`
  )

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw new Error(err)

    let websiteInfo = JSON.parse(data)
    res.json(websiteInfo)
    return
  })
})

app.get('/website/:id/records', (req, res) => {
  const filePath = path.join(
    __dirname,
    '..',
    'collections',
    `${req.params.id.toUpperCase()}.json`
  )

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw new Error(err)

    let websiteInfo = JSON.parse(data)
    let firstTen = { links: websiteInfo.links.slice(0, 10)}
    res.json(firstTen)
    return
  })
})

app.get('/website/:id/records/:pageNumber', (req, res) => {
  const filePath = path.join(
    __dirname,
    '..',
    'collections',
    `${req.params.id.toUpperCase()}.json`
  )
  const pageNumber = Number.parseInt(req.params.pageNumber)
  const recordsPerPage = 10
  const initialRecord = pageNumber * recordsPerPage

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw new Error(err)

    let websiteInfo = JSON.parse(data)
    let tenRecords = { links: websiteInfo.links.slice(initialRecord, initialRecord + 10)}
    res.json(tenRecords)
    return
  })
})

app.get('/website/:id/record/:recordID', (req, res) => {
  const recordID = Number.parseInt(req.params.recordID)
  const filePath = path.join(
    __dirname,
    '..',
    'collections',
    `${req.params.id.toUpperCase()}.json`
  )

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw new Error(err)

    let websiteInfo = JSON.parse(data)
    let recordInfo = websiteInfo.links.find(link => link.index === recordID)
    if (!recordInfo) {
      res.statusCode = 403
      return
    }

    res.json(recordInfo)
    return
  })
})

app.get('*', (req, res) => {
  res.statusCode = 404
  res.end('404 - ' + req.url + ' not found')
})

app.listen(port)
console.log(`Server on port ${port} up and running!`)
