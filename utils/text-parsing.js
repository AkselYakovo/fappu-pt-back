function getInterval(text) {
  const interval_type_regex = /.*?(year|month|day|lifetime).*/i
  const interval_value_regex = /(\d{1,2})(?:\s(day|month|year))/i
  const trial_interval_regex = /^\*{1,4}.*?(?:2 day).*/i
  let intervalType, intervalValue

  if (interval_type_regex.test(text)) {
    intervalType = interval_type_regex.exec(text)[1]
  }

  if (interval_value_regex.test(text)) {
    intervalValue = interval_value_regex.exec(text)[1]
  } else if (/lifetime/i.test(intervalType)) {
    intervalValue = 1
    intervalType = 'Litetime'
  } else if (trial_interval_regex.test(text)) {
    intervalValue = 2
    intervalType = 'Day'
  }

  if (!intervalType || !intervalValue) return false

  if (/^[a-z]/.test(intervalType))
    intervalType = intervalType.charAt(0).toUpperCase() + intervalType.slice(1)

  return {
    value: intervalValue,
    type: intervalType
  }
}

function getPrice(text) {
  let price
  const price_regex = /.*?\$(\d{1,3}\.\d\d)/
  const trial_interval_regex = /^\*{1,4}.*?(?:2 day).*/i
  const week_trial_interval_regex = /^\*+full access.*$/i

  if (trial_interval_regex.test(text)) price = '1.00'
  else if (week_trial_interval_regex.test(text))
    price = price_regex.exec(text)[1]
  else if (price_regex.test(text)) price = price_regex.exec(text)[1]

  if (!price) return false
  else return price
}

function checkForDownloads(text) {
  const valid_downloads_regex =
    /(\d{1,2}\W(?:day|year|month)).*?downloads.*?expires/i
  const interval_regex = /(\d{1,2}\W(?:day|year|month))/gi
  let intervalsWithDownloads = []

  if (valid_downloads_regex.test(text))
    intervalsWithDownloads = [...text.match(interval_regex)]
  else return false

  /** Swap string values for object equivalents inside the @var intervalsWithDownloads */
  for (let interval of intervalsWithDownloads) {
    let index = intervalsWithDownloads.indexOf(interval)
    intervalData = getInterval(interval)
    intervalsWithDownloads[index] = {}
    // let swappedIntervals = {}
    if (intervalData.type === 'Day' && intervalData.value === '30') {
      intervalsWithDownloads[index]['1'] = 'Month'
      continue
    } else if (intervalData.type === 'Month' && intervalData.value === '12') {
      intervalsWithDownloads[index]['1'] = 'Year'
    } else {
      intervalsWithDownloads[index][intervalData.value] = intervalData.type
    }
  }

  return intervalsWithDownloads
}

module.exports = { getInterval, getPrice, checkForDownloads }
