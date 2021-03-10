import { generateNCase } from './utils'

describe('BruteForce', function() {
  describe('Efficiency', function() {
    this.timeout(10 * 1000)

    const casesCompare = [20, 40, 100, 200, 500, 1000, 2745, 3000, 5000, 7719, 10000, 20000]
    for (let x of casesCompare) {
      it(`should pass the case of ${x} points`, generateNCase(x))
    }
  })
})