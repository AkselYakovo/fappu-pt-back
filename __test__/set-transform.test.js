const {
  createSet,
  normalizeSet,
  appendDownloads
} = require('../utils/set-transform')

describe('Set creation', () => {
  const textArray = [
    'DOWNLOADS INCLUDED',
    '1 YEAR MEMBERSHIP',
    'Billed in one payment of $119.99'
  ]

  it('correctly creates a set given a valid array of texts', () => {
    const set = createSet(textArray)
    expect(set).toEqual[
      {
        interval: 'Year',
        duration: '1',
        price: '119.99',
        hasDownloads: true
      }
    ]
  })
})

describe('Set transformation utilities', () => {
  it('normalizes the scrapped set into the standarized form', () => {
    const initialSet = [
      {
        duration: '12',
        type: 'month',
        price: '9.99',
        includesDownloads: true
      },
      {
        duration: '2',
        type: 'Day',
        price: '1.00',
        includesDownloads: false
      },
      {
        duration: '30',
        type: 'Day',
        price: '17.99',
        includesDownloads: false
      }
    ]
    const set = normalizeSet(initialSet)
    const normalizedSet = [
      {
        duration: '1',
        type: 'Year',
        price: '119.99',
        includesDownloads: true
      },
      {
        duration: '2',
        type: 'Day',
        price: '1.00',
        includesDownloads: false
      },
      {
        duration: '1',
        type: 'Month',
        price: '17.99',
        includesDownloads: false
      }
    ]
    expect(set).toEqual(normalizedSet)
  })

  it('normalizes the scrapped set into the standarized form (multiple months case)', () => {
    const initialSet = [
      {
        duration: '12',
        type: 'month',
        price: '9.99',
        includesDownloads: true
      },
      {
        duration: '2',
        type: 'Day',
        price: '1.00',
        includesDownloads: false
      },
      {
        duration: '3',
        type: 'Month',
        price: '17.99',
        includesDownloads: false
      }
    ]
    const set = normalizeSet(initialSet)
    const normalizedSet = [
      {
        duration: '1',
        type: 'Year',
        price: '119.99',
        includesDownloads: true
      },
      {
        duration: '2',
        type: 'Day',
        price: '1.00',
        includesDownloads: false
      },
      {
        duration: '3',
        type: 'Month',
        price: '53.99',
        includesDownloads: false
      }
    ]
    expect(set).toEqual(normalizedSet)
  })

  it('normalizes the scrapped set into the standarized form (more than 12 months case)', () => {
    const initialSet = [
      {
        duration: '18',
        type: 'Month',
        price: '6.66',
        includesDownloads: true
      },
      {
        duration: '2',
        type: 'Day',
        price: '1.00',
        includesDownloads: false
      },
      {
        duration: '30',
        type: 'Day',
        price: '17.99',
        includesDownloads: false
      }
    ]
    const set = normalizeSet(initialSet)
    const normalizedSet = [
      {
        duration: '18',
        type: 'Month',
        price: '119.99',
        includesDownloads: true
      },
      {
        duration: '2',
        type: 'Day',
        price: '1.00',
        includesDownloads: false
      },
      {
        duration: '1',
        type: 'Month',
        price: '17.99',
        includesDownloads: false
      }
    ]
    expect(set).toEqual(normalizedSet)
  })

  it('Appends the downloads options to the correct scrapped intervals', () => {
    const initialSet = [
      {
        duration: '1',
        type: 'Year',
        price: '121.99',
        includesDownloads: false
      },
      {
        duration: '2',
        type: 'Day',
        price: '1.00',
        includesDownloads: false
      },
      {
        duration: '1',
        type: 'Month',
        price: '17.99',
        includesDownloads: false
      }
    ]
    const transformedSet = [
      {
        duration: '1',
        type: 'Year',
        price: '121.99',
        includesDownloads: true
      },
      {
        duration: '2',
        type: 'Day',
        price: '1.00',
        includesDownloads: false
      },
      {
        duration: '1',
        type: 'Month',
        price: '17.99',
        includesDownloads: false
      }
    ]
    const intervalsWithDownloads = [{ 1: 'Year' }]
    appendDownloads(initialSet, intervalsWithDownloads)
    expect(initialSet).toEqual(transformedSet)
  })

  it('Appends the downloads options to the correct scrapped intervals (repeated intervals w/ different prices)', () => {
    const initialSet = [
      {
        duration: '1',
        type: 'Year',
        price: '121.99',
        includesDownloads: false
      },
      {
        duration: '1',
        type: 'Month',
        price: '24.99',
        includesDownloads: false
      },
      {
        duration: '1',
        type: 'Month',
        price: '17.99',
        includesDownloads: false
      }
    ]
    const transformedSet = [
      {
        duration: '1',
        type: 'Year',
        price: '121.99',
        includesDownloads: true
      },
      {
        duration: '1',
        type: 'Month',
        price: '24.99',
        includesDownloads: true
      },
      {
        duration: '1',
        type: 'Month',
        price: '17.99',
        includesDownloads: false
      }
    ]
    const intervalsWithDownloads = [{ 1: 'Month' }, { 1: 'Year' }]
    appendDownloads(initialSet, intervalsWithDownloads)
    expect(initialSet).toEqual(transformedSet)
  })

  it('Appends the downloads options to the correct scrapped intervals (repeated intervals w/ different prices & cheaper first)', () => {
    const initialSet = [
      {
        duration: '1',
        type: 'Year',
        price: '121.99',
        includesDownloads: false
      },
      {
        duration: '1',
        type: 'Month',
        price: '17.99',
        includesDownloads: false
      },
      {
        duration: '1',
        type: 'Month',
        price: '24.99',
        includesDownloads: false
      }
    ]
    const transformedSet = [
      {
        duration: '1',
        type: 'Year',
        price: '121.99',
        includesDownloads: true
      },
      {
        duration: '1',
        type: 'Month',
        price: '17.99',
        includesDownloads: false
      },
      {
        duration: '1',
        type: 'Month',
        price: '24.99',
        includesDownloads: true
      }
    ]
    const intervalsWithDownloads = [{ 1: 'Year' }, { 1: 'Month' }]
    appendDownloads(initialSet, intervalsWithDownloads)
    expect(initialSet).toEqual(transformedSet)
  })
})
