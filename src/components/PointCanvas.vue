<template>
  <canvas ref="canvasObj" width="640" height="480" @click="addPoint" v-if="props.points.length < 5000"></canvas>
  <div class="error-hint" v-else>Sorry, there're too many points to display.</div>
</template>

<script lang="ts" setup>
import { Point } from '../algorithm/Point'
import { ref, onUpdated, defineProps, onMounted, defineEmit } from 'vue'

const props = defineProps({
  points: {
    type: Array,
    required: true
  },
  marked: { type: Boolean, default: false },
  pointAX: { type: Number },
  pointAY: { type: Number },
  pointBX: { type: Number },
  pointBY: { type: Number },
  scaleFactor: { type: Number, default: 1.0 }
})

const emit = defineEmit(['update:points'])

const canvasObj = ref<HTMLCanvasElement>()

// calculate borders
let xMax = Number.MIN_VALUE, xMin = Number.MAX_VALUE,
    yMax = Number.MIN_VALUE, yMin = Number.MAX_VALUE

function updateLimits() {
  xMax = Number.MIN_VALUE, xMin = Number.MAX_VALUE, yMax = Number.MIN_VALUE, yMin = Number.MAX_VALUE
  for (let p of (props.points as Point[])) {
    xMax = Math.max(xMax, p.x); xMin = Math.min(xMin, p.x)
    yMax = Math.max(yMax, p.y); yMin = Math.min(yMin, p.y)
  }
  xMin -= 3, xMax += 3, yMin -= 3, yMax += 3
}

function mapPointToCanvasCoord(p: Point): [number, number] {
  const canvas = canvasObj.value
  if (!canvas) return [0, 0]
  const xRatio = props.scaleFactor * canvas.width / (xMax - xMin),
        yRatio = props.scaleFactor * -1 * canvas.height / (yMax - yMin)
  return [xRatio * (p.x - xMin), canvas.height + yRatio * (p.y - yMin)]
}

function mapPointFromCanvasCoord(x: number, y: number): Point {
  const canvas = canvasObj.value
  if (!canvas) {
    return new Point(0, 0)
  } else {
    const xRatio = canvas.width / ((xMax - xMin) * props.scaleFactor),
          yRatio = -1 * canvas.height / ((yMax - yMin) * props.scaleFactor)
    return new Point(x / xRatio + xMin, (y - canvas.height) / yRatio + yMin)
  }
}

function addPoint(evt: MouseEvent) {
  if (!canvasObj.value) {
    return
  }
  const rect = canvasObj.value.getBoundingClientRect()
  const canvasX = evt.x - rect.left, canvasY = evt.y - rect.top
  const newPoints = Array.from(props.points)
  newPoints.push(mapPointFromCanvasCoord(canvasX, canvasY))
  emit('update:points', newPoints)
}

function drawCanvas() {
  if (! canvasObj.value || ! props.points.length) {
    return
  }
  const canvas: HTMLCanvasElement = canvasObj.value

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  updateLimits()

  const points: Point[] = props.points as Point[]
  const radiusInner = canvas.width / 100
  const radiusOuter = radiusInner + canvas.width / 300

  function drawPoint(ctx: CanvasRenderingContext2D, p: Point, 
    typeOfDrawing: 'marked' | 'normal' = 'normal'): void {
    
    const [px, py] = mapPointToCanvasCoord(p)

    ctx.beginPath()
    ctx.fillStyle = typeOfDrawing === 'normal' ? '#FF6459' : '#FF6459'
    ctx.ellipse(px, py, radiusOuter, radiusOuter, 0, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.beginPath()
    ctx.fillStyle = '#E8FF26'
    ctx.ellipse(px, py, radiusInner, radiusInner, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let i = 0; i < points.length; i++) {
    drawPoint(ctx, points[i], 'normal')
  }

  if (props.marked) {
    drawPoint(ctx, new Point(props.pointAX, props.pointAY), 'marked')
    drawPoint(ctx, new Point(props.pointBX, props.pointBY), 'marked')
    ctx.beginPath()
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.moveTo(...mapPointToCanvasCoord(new Point(props.pointAX, props.pointAY)))
    ctx.lineTo(...mapPointToCanvasCoord(new Point(props.pointBX, props.pointBY)))
    ctx.stroke()
  }
}

onMounted(drawCanvas)
onUpdated(drawCanvas)
    
</script>

<style scoped>
.error-hint {
  width: 640px;
  height: 480px;
  font-size: 22px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: grid;
  align-items: center;
  justify-items: center;
}
</style>