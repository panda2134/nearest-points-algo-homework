import { AlgoBase, NearestPair } from './AlgoBase'
import { Point } from './Point';
import { arrayMerge } from './Helper'

export class DivConquer implements AlgoBase {
  private points: Point[] = [];

  /**
   * Use divide-and-conquer to solve the problem on [l, r)
   * @param l left endpoint (included)
   * @param r right endpoint (not included)
   * @requires this.points is sorted by x position
   */
  private divide(l: number, r: number): NearestPair {
    if (r - l == 2) {
      const ret = new NearestPair([this.points[l], this.points[r - 1]])
      if (this.points[r - 1].y < this.points[l].y) {
        [this.points[r - 1], this.points[l]] = [this.points[l], this.points[r - 1]] 
      }
      return ret
    } else if (r - l <= 1) {
      return NearestPair.inf()
    } else {
      const indexMid = ((l + r) >> 1)
      const xMid = this.points[indexMid].x

      let res = this.divide(l, indexMid).getNearer(this.divide(indexMid, r))
      const d = res.getDistance()

      const ySortedSlice = 
        arrayMerge(this.points.slice(l, indexMid), this.points.slice(indexMid, r), (a, b) => a.y - b.y)
      for (let k = l; k < r; k++) {
        this.points[k] = ySortedSlice[k - l] // copy with a for-loop for efficiency
      }
      
      const pointsInXRange: Point[] = []

      for (let k = l; k < r; k++) {
        if (Math.abs(this.points[k].x - xMid) <= d) {
          pointsInXRange.push(this.points[k])
        }
      }

      for (let k = 0; k < pointsInXRange.length; k++) {
        for (let j = k - 1; j >= 0 && (pointsInXRange[k].y - pointsInXRange[j].y <= d); j--) {
          res = res.getNearer(new NearestPair([pointsInXRange[k], pointsInXRange[j]]))
        }
      }

      return res
    }
  }

  public init(points: Point[]): void {
    this.points = points
    this.points.sort((a, b) => a.x - b.x)
  }
  
  public solve(): NearestPair {
    return this.divide(0, this.points.length)
  }
}