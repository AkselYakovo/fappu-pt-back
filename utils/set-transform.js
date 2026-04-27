const { getPrice, getInterval, checkForDownloads } = require('./text-parsing')

function createSet(textsArray) {
  const main_text_regex = /^\*+\d{1,2}.*$/
  const lifetime_text_regex = /^\*+(:?lifetime).*$/i
  const trial_text_regex = /^\*{1,4}.+(:?2 day)/i
  const week_trial_interval_regex = /^\*+full access.*$/i

  let set = [],
    intervalsWithDownloads,
    includesDownloads,
    validText,
    interval,
    price

  for (let i = 0; i < textsArray.length; i++) {
    const currentText = textsArray[i]
    const MAX_STRING_LENGTH_ALLOWED = 150

    if (currentText.length > MAX_STRING_LENGTH_ALLOWED) continue

    if (
      main_text_regex.test(currentText) ||
      trial_text_regex.test(currentText) ||
      lifetime_text_regex.test(currentText) ||
      week_trial_interval_regex.test(currentText) ||
      checkForDownloads(currentText)
    )
      validText = true
    else validText = false

    if (validText) {
      // console.log('valid text: ', currentText)
    } else {
      // console.log('invalid text:', currentText)
      continue
    }

    if (checkForDownloads(currentText))
      intervalsWithDownloads = checkForDownloads(currentText)

    if (getInterval(currentText)) interval = getInterval(currentText)

    if (getPrice(currentText)) price = getPrice(currentText)

    if (interval && price) {
      let scrapedData = {
        duration: interval.value,
        type: interval.type,
        price,
        includesDownloads: false
      }

      set.push(scrapedData)

      includesDownloads = null
      price = null
      interval = null
    } else {
      price = null
      interval = null
    }
  }

  const normalizedSet = normalizeSet(set)

  if (intervalsWithDownloads)
    appendDownloads(normalizedSet, intervalsWithDownloads)

  return normalizedSet
}

function normalizeSet(setArray) {
  let newSet = [],
    transformedScrape = {}

  for (let i = 0; i < setArray.length; i++) {
    const currentSet = setArray[i]
    let duration,
      type,
      price,
      includesDownloads = currentSet.includesDownloads

    switch (currentSet.type.toUpperCase()) {
      case 'DAY':
        if (Number.parseInt(currentSet.duration) == 30) {
          type = 'Month'
          duration = '1'
        } else if (
          Number.isInteger(Number.parseInt(currentSet.duration) / 30)
        ) {
          type = 'Month'
          duration = `${Number.parseInt(currentSet.duration) / 30}`
        }

        transformedScrape = {
          duration: duration || currentSet.duration,
          type: type || currentSet.type,
          price: currentSet.price,
          includesDownloads
        }
        break
      case 'MONTH':
        // if (
        //   Number.parseInt(currentSet.duration) > 1 &&
        //   Number.parseInt(currentSet.duration) !== 12
        // ) {
        //   price = Number.parseInt(currentSet.price * currentSet.duration)
        //     .toString()
        //     .concat('.99')
        // }

        if (Number.parseInt(currentSet.duration) == 12) {
          duration = '1'
          type = 'Year'

          if (Number.parseInt(currentSet.price) <= 50) {
            price = Number.parseInt(Number.parseFloat(currentSet.price) * 12)
              .toString()
              .concat('.99')
          }
        }

        if (Number.parseInt(currentSet.duration) > 12) {
          // if (Number.parseInt(currentSet.duration) % 12 == 0) {
          //   type = 'Year'
          //   duration = Number.parseInt(currentSet.duration) / 12
          // }
          // if (Number.parseInt(currentSet.price) <= 50) {
          //   price = Number.parseInt(Number.parseFloat(currentSet.price) * 12)
          //     .toString()
          //     .concat('.99')
          // }
        }

        transformedScrape = {
          duration: duration || currentSet.duration,
          type: type || currentSet.type,
          price: price || currentSet.price,
          includesDownloads
        }
        break

      case 'YEAR':
        if (Number.parseInt(currentSet.price) <= 50)
          price = Number.parseInt(
            Number.parseFloat(currentSet.price) *
              Number.parseInt(currentSet.duration)
          )
            .toString()
            .concat('.99')

        transformedScrape = {
          duration: currentSet.duration,
          type: currentSet.type,
          price: price || currentSet.price,
          includesDownloads
        }
        break

      case 'LIFETIME':
        transformedScrape = {
          duration: currentSet.duration,
          type: currentSet.type,
          price: price || currentSet.price,
          includesDownloads
        }
        break

      default:
        transformedScrape = {
          duration: false,
          type: false,
          price: false,
          includesDownloads: false
        }
        break
    }

    newSet.push(transformedScrape)
  }
  return newSet
}

function appendDownloads(set, intervalsWithDownloads) {
  let lookUpRepeated = false
  for (let interval of intervalsWithDownloads) {
    let duration, type
    for (let prop in interval) duration = prop
    type = interval[duration]
    if (type === 'Month') lookUpRepeated = true
    for (let i = 0; i < set.length; i++) {
      const currentScrape = set[i]

      if (lookUpRepeated) {
        for (let j = i + 1; j < set.length; j++) {
          const nextScrape = set[j]
          if (nextScrape.type === 'Month' && nextScrape.duration == duration) {
            if (
              Number.parseInt(nextScrape.price) >
              Number.parseInt(currentScrape.price)
            )
              nextScrape.includesDownloads = true
            else currentScrape.includesDownloads = true
          }
        }
        continue
      }

      if (currentScrape.type == type && currentScrape.duration == duration) {
        currentScrape.includesDownloads = true
        break
      }
    }
  }
}

module.exports = { createSet, normalizeSet, appendDownloads }
