const {
  createSet,
  normalizeSet,
  appendDownloads
} = require('../utils/set-transform')

describe('Set creation', () => {
  it('correctly creates a set (no downloads | common intervals)', () => {
    const textArray = [
      '*Limited access 2 day trial period automatically rebilling at $39.99',
      '**12 Month Membership initial charge of $59.99 automatically rebills at $119.99',
      '*30 Day Membership initial charge of $19.99 automatically rebilling at $39.99'
    ]
    const set = createSet(textArray)

    expect(set).toEqual([
      {
        type: 'Day',
        duration: '2',
        price: '1.00',
        includesDownloads: false
      },
      {
        type: 'Year',
        duration: '1',
        price: '59.99',
        includesDownloads: false
      },
      {
        type: 'Month',
        duration: '1',
        price: '19.99',
        includesDownloads: false
      }
    ])
  })

  it('correctly creates a set (w/ downloads | common intervals)', () => {
    const textArray = [
      '*Limited access 2 day trial period automatically rebilling at $39.99',
      '**12 Month Membership initial charge of $59.99 automatically rebills at $119.99',
      '*30 Day Membership initial charge of $19.99 automatically rebilling at $39.99',
      '30 Day Membership + Downloads, 12 Month Membership + Downloads include Downloads. Access to Downloads expires'
    ]
    const set = createSet(textArray)

    expect(set).toEqual([
      {
        type: 'Day',
        duration: '2',
        price: '1.00',
        includesDownloads: false
      },
      {
        type: 'Year',
        duration: '1',
        price: '59.99',
        includesDownloads: true
      },
      {
        type: 'Month',
        duration: '1',
        price: '19.99',
        includesDownloads: true
      }
    ])
  })

  it('correctly creates a set (no downloads | uncommon intervals #1)', () => {
    const textArray = [
      '*Limited access 2 day trial period automatically rebilling at $39.99',
      '**18 Month Membership initial charge of $119.99 automatically rebills at $119.99',
      '*90 Day Membership initial charge of $54.99 automatically rebilling at $54.99'
    ]
    const set = createSet(textArray)

    expect(set).toEqual([
      {
        type: 'Day',
        duration: '2',
        price: '1.00',
        includesDownloads: false
      },
      {
        type: 'Month',
        duration: '18',
        price: '119.99',
        includesDownloads: false
      },
      {
        type: 'Month',
        duration: '3',
        price: '54.99',
        includesDownloads: false
      }
    ])
  })

  it('correctly creates a set (no downloads | uncommon intervals #2)', () => {
    const textArray = [
      '*Lifetime Membership initial charge of $199.99 with no rebilling',
      '**540 Day Membership initial charge of $119.99 automatically rebills at $119.99',
      '*180 Day Membership initial charge of $59.99 automatically rebilling at $59.99'
    ]
    const set = createSet(textArray)

    expect(set).toEqual([
      {
        type: 'Lifetime',
        duration: '1',
        price: '199.99',
        includesDownloads: false
      },
      {
        type: 'Month',
        duration: '18',
        price: '119.99',
        includesDownloads: false
      },
      {
        type: 'Month',
        duration: '6',
        price: '59.99',
        includesDownloads: false
      }
    ])
  })
})

describe('Set transformation utilities', () => {
  it('normalizes the scraped set into the standarized form', () => {
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

  it('normalizes the scraped set into the standarized form (multiple months case)', () => {
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

  it('normalizes the scraped set into the standarized form (multiple months as days case)', () => {
    const initialSet = [
      {
        duration: '12',
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
        duration: '90',
        type: 'Day',
        price: '39.99',
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
        price: '39.99',
        includesDownloads: false
      }
    ]
    expect(set).toEqual(normalizedSet)
  })

  it('Appends the downloads options to the correct scraped intervals', () => {
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

  it('Appends the downloads options to the correct scraped intervals (repeated intervals w/ different prices)', () => {
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

  it('Appends the downloads options to the correct scraped intervals (repeated intervals w/ different prices & cheaper first)', () => {
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
