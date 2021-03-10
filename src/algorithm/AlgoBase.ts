import { Point } from './Point'

export class NearestPair {
  private distance: number
  private static pairList: NearestPair[] = []

  constructor(private pointPair: [Point, Point]) {
    this.distance = pointPair[0].distanceTo(pointPair[1])
    NearestPair.pairList.push(this)
  }

  static getPairList(): NearestPair[] {
    return NearestPair.pairList.filter(p => Number.isFinite(p.distance))
  }

  static clearPairList(): void {
    NearestPair.pairList = []
  }

  static inf(): NearestPair {
    const ret = new NearestPair([new Point(), new Point()])
    ret.distance = Number.POSITIVE_INFINITY
    return ret
  }

  getDistance(): number { return this.distance }
  getPointPair(): [Point, Point] { return this.pointPair }
  getNearer(rhs: NearestPair): NearestPair {
    const delta = this.distance - rhs.distance;
    if (Math.abs(delta) < Number.EPSILON) {
      return this
    } else {
      return delta < 0 ? this : rhs
    }
  }
}

export interface AlgoBase {
  init(points: Point[]): void;
  solve(): NearestPair;
}