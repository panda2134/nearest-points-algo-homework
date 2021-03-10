import { DivConquer } from './../src/algorithm/DivConquer'
import { Point } from './../src/algorithm/Point'
import assert from 'assert'
import { generateNCase } from './utils';

describe('DivideAndConquer', function () {
  it('should pass the most trivial case of 3 points', () => {
    const pts = [new Point(0, 0), new Point(0, 1), new Point(1, 0)]
    const algo = new DivConquer
    algo.init(pts)
    assert(Math.abs(algo.solve().getDistance() - 1.0) < Number.EPSILON)
  })

  describe('Correctness', function() {
    this.timeout(5 * 1000)
  
    const casesCompare = [20, 40, 100, 200, 500, 1000, 2745, 3000]
    for (let x of casesCompare) {
      it(`should pass the case of ${x} points`, generateNCase(x))
    }
  })

  describe('Complexity', function() {
    this.timeout(12 * 1000)

    const casesComplexity = [20, 40, 100, 200, 500, 1000, 2745, 3000, 5000, 7719, 10000, 20000,
      50000, 100000, 200000, 399999, 400000, 800000, 1091723, 2124039, 2900281]
    for (let x of casesComplexity) {
      it(`should pass the case of ${x} points`, generateNCase(x, false))
    }
  })
})