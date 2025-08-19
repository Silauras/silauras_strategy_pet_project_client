<template>
  <canvas
      ref="canvas"
      :width="width"
      :height="height"
      @wheel.prevent="onWheel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const width = 800
const height = 800

const tileSize = 16
const tilesX = 64
const tilesY = 64

let scale = 1
let offsetX = 0
let offsetY = 0
let isDragging = false
let lastMouseX = 0
let lastMouseY = 0

function clampCamera() {
  const worldWidth = tilesX * tileSize * scale
  const worldHeight = tilesY * tileSize * scale

  const gapX = width * 0.5
  const gapY = height * 0.5

  const minOffsetX = width - worldWidth - gapX
  const minOffsetY = height - worldHeight - gapY
  const maxOffsetX = gapX
  const maxOffsetY = gapY

  offsetX = Math.min(maxOffsetX, Math.max(minOffsetX, offsetX))
  offsetY = Math.min(maxOffsetY, Math.max(minOffsetY, offsetY))
}


function drawMap() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.imageSmoothingEnabled = false

  ctx.fillStyle = '#0b2e13'
  ctx.fillRect(0, 0, width, height)

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#88c070' : '#70a858'
      ctx.fillRect(
          offsetX + x * tileSize * scale,
          offsetY + y * tileSize * scale,
          tileSize * scale,
          tileSize * scale
      )
    }
  }

  ctx.strokeStyle = '#333'
  ctx.lineWidth = 1
  for (let x = 0; x <= tilesX; x++) {
    ctx.beginPath()
    ctx.moveTo(offsetX + x * tileSize * scale, offsetY)
    ctx.lineTo(offsetX + x * tileSize * scale, offsetY + tilesY * tileSize * scale)
    ctx.stroke()
  }
  for (let y = 0; y <= tilesY; y++) {
    ctx.beginPath()
    ctx.moveTo(offsetX, offsetY + y * tileSize * scale)
    ctx.lineTo(offsetX + tilesX * tileSize * scale, offsetY + y * tileSize * scale)
    ctx.stroke()
  }
}

function centerWorld() {
  const worldWidth = tilesX * tileSize * scale
  const worldHeight = tilesY * tileSize * scale
  offsetX = (width - worldWidth) / 2
  offsetY = (height - worldHeight) / 2
}


function onWheel(e: WheelEvent) {
  const zoomIntensity = 0.1
  if (e.deltaY < 0) scale *= 1 + zoomIntensity
  else scale *= 1 - zoomIntensity

  scale = Math.max(0.5, Math.min(4, scale))
  if (scale > 3.5){
    centerWorld()
  }

  clampCamera()
  drawMap()
}

function onMouseDown(e: MouseEvent) {
  isDragging = true
  lastMouseX = e.clientX
  lastMouseY = e.clientY
}

function onMouseMove(e: MouseEvent) {
  if (isDragging) {
    offsetX += e.clientX - lastMouseX
    offsetY += e.clientY - lastMouseY
    lastMouseX = e.clientX
    lastMouseY = e.clientY

    clampCamera()
    drawMap()
  }
}

function onMouseUp() {
  isDragging = false
}

onMounted(() => {
  centerWorld()
  clampCamera()
  drawMap()
})
</script>

<style scoped>
canvas {
  border: 2px solid #444;
  background: #111;
  cursor: grab;
}
canvas:active {
  cursor: grabbing;
  image-rendering: pixelated;
}
</style>