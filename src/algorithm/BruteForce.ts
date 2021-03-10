import { AlgoBase, NearestPair } from './AlgoBase'
import { Point } from './Point'

export class BruteForce implements AlgoBase {
  private points: Point[] = []

  init(points: Point[]): void {
    this.points = points
  }
  solve(): NearestPair {
    let res = NearestPair.inf()

    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        res = res.getNearer(new NearestPair([this.points[i], this.points[j]]))
      }
    }

    return res;
  }

}