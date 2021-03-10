import { BruteForce } from '../src/algorithm/BruteForce';
import { DivConquer } from '../src/algorithm/DivConquer';
import { Point } from '../src/algorithm/Point';
import assert from 'assert';

export function generateNCase(n: number, compare: boolean = true) {
  return () => {
    const pts: Point[] = [];
    for (let i = 0; i < n; i++) {
      pts.push(new Point(Math.random() * 1000, Math.random() * 1000));
    }

    const div = new DivConquer;
    div.init(pts);
    const r1 = div.solve();
    if (compare) {
      const bf = new BruteForce;
      bf.init(pts);
      const r2 = bf.solve();

      assert(Math.abs(r1.getDistance() - r2.getDistance()) < Number.EPSILON);
    } else {
      assert(r1.getDistance() > 0);
    }
  };
}
