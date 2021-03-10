import { NearestPair } from '../algorithm/AlgoBase'
import { Point } from '../algorithm/Point'

export interface WorkStartMessage {
  algorithm: 'BruteForce' | 'DivConquer';
  points: ({x: number; y:number})[]
}

export interface WorkEndMessage {
  result: object;
  resultSequence: object[]
}