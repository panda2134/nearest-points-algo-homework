<template>
  <div id="app-root">
    <h1>
      Find out the nearest point pair
    </h1>
    <main>
      <point-canvas
        v-model:points="points"
        :marked="marked"
        :point-a-x="pointPair[0].x"
        :point-a-y="pointPair[0].y"
        :point-b-x="pointPair[1].x"
        :point-b-y="pointPair[1].y"
      />
    </main>
    <div class="tools" action="">
      <h2>Tools</h2>
      <fieldset>
        <legend>Generate Points</legend>
        <input type="number" v-model="pointCount" class="input"/>
        <button type="button" class="btn" @click="randomize">Randomize</button>
      </fieldset>
      <fieldset>
        <legend>Algorithm</legend>
        <div>
          <select v-model="algoChoice" class="input">
            <option value="BruteForce">Brute Force</option>
            <option value="DivConquer">Divide and Conquer</option>
          </select>
          <button 
            type="button" 
            class="btn btn-tight"
            @click="doComputation"
            :disabled="computing"
          >{{ computing ? 'Computing' : 'Compute' }}</button>
        </div>
        <div class="data">Run time: {{ !computing && runningTimeMs !== 0 ? runningTimeMs + 'ms' : 'please compute first' }}</div>
      </fieldset>
      <fieldset>
        <legend>Result and Replay</legend>
        <div class="data">
          Distance: {{ marked && !computing ? distance.toFixed(3) : 'none' }}
        </div>
        <div class="data" v-if="marked && !computing">
          <div>Point A: ({{ pointPair[0].x.toFixed(2) }}, {{ pointPair[0].y.toFixed(2) }})</div>
          <div>Point B: ({{ pointPair[1].x.toFixed(2) }}, {{ pointPair[1].y.toFixed(2) }})</div>
        </div>
        <div v-show="!computing && !first">
          <h4>Step chooser</h4>
          <step-chooser :length="resultSequence.length" v-model:val="currentStep" />
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script lang="ts" setup>
import './assets/common.css'
import { defineComponent, ref, reactive, computed, watch, onMounted } from 'vue'
import PointCanvas from './components/PointCanvas.vue'
import StepChooser from './components/StepChooser.vue'
import { Point } from './algorithm/Point'
import AlgoWorker from './worker/Algorithm.worker?worker'
import * as WorkerTypes from './worker/AlgoWorkerTypes'
import { NearestPair } from './algorithm/AlgoBase'

const points = ref([new Point(0, 0), new Point(0, 3), new Point(-2, -2), new Point(-8, 6), new Point(3, -2)])
const algoChoice = ref('DivConquer')
let result = ref({})
let computing = ref(false)
let resultSequence = ref([] as Object[])
let marked = ref(false)
let first = ref(true)
let distance = ref(0.0)
let pointPair = ref([{ x: 0, y: 0 }, { x: 0, y: 0 }])
let pointCount = ref(20)
let runningTimeMs = ref(0)
let currentStep = ref(0)

onMounted(() => {
  if (! navigator.userAgent.includes('Chrome')) {
    window.alert('Only works on Chrome / Chromium-based browsers')
  }
})

const worker = new AlgoWorker()

function showResult() {
  if (!(result.value as any).pointPair) {
    return
  }
  pointPair.value = (result.value as any).pointPair
  distance.value = (result.value as any).distance
  marked.value = true
}

function doComputation() {
  const message: WorkerTypes.WorkStartMessage = {
    algorithm: algoChoice.value == 'DivConquer' ? 'DivConquer' : 'BruteForce',
    points: JSON.parse(JSON.stringify(points.value))
  }
  first.value = false
  const runningStartTime = new Date()
  currentStep.value = 0
  worker.addEventListener('message', (evt) => {
    const res: WorkerTypes.WorkEndMessage = evt.data
    result.value = res.result
    resultSequence.value = res.resultSequence
    computing.value = false
    runningTimeMs.value = (new Date).getTime() - runningStartTime.getTime()
    showResult()
  })
  worker.postMessage(message)
  computing.value = true
}

function randomize() {
  points.value = []
  marked.value = false
  for (let i = 0; i < pointCount.value; i++) {
    points.value.push(new Point(Math.random() * 1000 - 500, Math.random() * 1000 - 500))
  }
  currentStep.value = 0
  resultSequence.value = []
}

watch(currentStep, () => {
  try {
    pointPair.value = (resultSequence.value[currentStep.value] as any).pointPair
    distance.value = (resultSequence.value[currentStep.value] as any).distance
    marked.value = true
  } catch (e) {}
})
</script>

<style lang="css" scoped>
body {
  padding: 0px;
}

#app-root {
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-rows: 1fr 9fr;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  width: 100vw;
  background-color: #409eff;
}

main {
  grid-area: 2 / 1 / 2 / 1;
  padding: 50px;
}

main > * {
  border-radius: 39px;
  background: linear-gradient(145deg, #44a9ff, #3a8ee6);
  box-shadow: 5px 5px 10px #3686d9, -5px -5px 10px #4ab6ff;
}

h1 {
  grid-area: 1 / 1 / span 1 / span 2;
  width: 100vw;
  text-align: center;
  margin-top: 0;
  margin-bottom: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 0.7em;
  padding-right: 0.7em;
  font-size: 25px;
}

.tools {
  grid-area: 2 / 2 / 2 / 2;
  border-radius: 39px;
  background: linear-gradient(145deg, #44a9ff, #3a8ee6);
  box-shadow: 5px 5px 10px #3686d9, -5px -5px 10px #4ab6ff;
  padding: 40px;
}

fieldset {
  margin-top: 1em;
  border: none
}
.tools .data {
  margin-top: 0.2em;
  margin-bottom: 0.2em;
}

legend {
  margin-bottom: 0.2em;
  font: bold 20px sans-serif;
}
</style>