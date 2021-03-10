import { BruteForce } from './../src/algorithm/BruteForce';
import { DivConquer } from './../src/algorithm/DivConquer'
import { Point } from './../src/algorithm/Point'
import assert from 'assert'

function generateNCase(n: number, compare: boolean = true) {
  return () => {
    const pts: Point[] = []
    for (let i = 0; i < n; i++) {
      pts.push(new Point(Math.random() * 1000, Math.random() * 1000))
    }

    const div = new DivConquer
    div.init(pts)
    const r1 = div.solve()
    if (compare) {
      const bf = new BruteForce
      bf.init(pts)
      const r2 = bf.solve()

      assert(Math.abs(r1.getDistance() - r2.getDistance()) < Number.EPSILON)
    } else {
      assert(r1.getDistance() > 0)
    }
  }
}

describe('DivideAndConquer', function () {
  it('should pass the most trivial case of 3 points', () => {
    const pts = [new Point(0, 0), new Point(0, 1), new Point(1, 0)]
    const algo = new DivConquer
    algo.init(pts)
    assert(Math.abs(algo.solve().getDistance() - 1.0) < Number.EPSILON)
  })

  describe('Correctness', function() {
    this.timeout(5 * 1000)
  
    const casesCompare = [20, 40, 100, 200, 500, 1000, 2745, 3000, 5000, 7719, 10000, 20000]
    for (let x of casesCompare) {
      it(`should pass the case of ${x} points`, generateNCase(x))
    }
  })

  describe('Complexity', function() {
    this.timeout(12 * 1000)

    const casesComplexity = [50000, 100000, 200000, 399999, 400000, 800000, 1091723, 2124039, 2900281]
    for (let x of casesComplexity) {
      it(`should pass the case of ${x} points`, generateNCase(x, false))
    }
  })
})