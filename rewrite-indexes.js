const { rewriteFaultyIndexes } = require('./utils/record-porcelain')
const website = process.argv[2].toUpperCase()

function run() {
  rewriteFaultyIndexes()
  return
}

run()
