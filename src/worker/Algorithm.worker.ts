import { DivConquer } from '../algorithm/DivConquer';
import { NearestPair, AlgoBase } from '../algorithm/AlgoBase'
import { BruteForce } from '../algorithm/BruteForce'
import { Point } from '../algorithm/Point'
import { WorkStartMessage, WorkEndMessage } from './AlgoWorkerTypes'

addEventListener('message', function (evt) {
  const data = evt.data as WorkStartMessage
  let algo: AlgoBase = data.algorithm === 'BruteForce' ? new BruteForce() : new DivConquer()
  let points: Point[] = []
  NearestPair.clearPairList()
  console.log(data.points)
  for (let pRaw of data.points) {
    points.push(new Point(pRaw.x, pRaw.y))
  }
  console.log(points)
  algo.init(points)
  const result = algo.solve()
  const resultSequence = NearestPair.getPairList()
  resultSequence.push(result);
  ((this as unknown) as Worker).postMessage({ result, resultSequence })
})