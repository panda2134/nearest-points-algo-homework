export class Point {
  distanceTo(rhs: Point) {
    return Math.sqrt((this.x - rhs.x) * (this.x - rhs.x) 
          + (this.y - rhs.y) * (this.y - rhs.y))
  }

  constructor(public x: number = .0, public y: number = .0) {}
}