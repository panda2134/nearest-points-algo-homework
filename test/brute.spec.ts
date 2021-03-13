import { generateNCase } from './utils'

describe('BruteForce', function() {
  describe('Efficiency', function() {
    this.timeout(30 * 1000)

    const casesCompare = [20, 30, 40, 100, 300, 500, 700, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2745, 3000, 5000]
    for (let x of casesCompare) {
      it(`should pass the case of ${x} points`, generateNCase(x))
    }
  })
})