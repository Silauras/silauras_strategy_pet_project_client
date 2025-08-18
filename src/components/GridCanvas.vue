<template>
  <canvas ref="canvas" width="800" height="800"
          @wheel="onwheel"
          @mousedown="startDrag($event)"
          @mousemove="ondrag($event)"
          @mouseup="endDrag"
          @mouseleave="endDrag"/>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const emit = defineEmits(['update:zoom'])

const canvas = ref<HTMLCanvasElement | null>(null)

const GRID_SIZE = 1000
const CELL_SIZE = 4

const camera = ref({
  x: 0,
  y: 0,
  zoom: 1,
})

watch(() => camera.value.zoom, (newZoom) => {
  emit('update:zoom', newZoom)
})

//drag state
let dragging = false
let lastMouse = {x: 0, y: 0}

function getMousePos(e: MouseEvent) {
  const rect = canvas.value!.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

function startDrag(e: MouseEvent) {
  dragging = true
  lastMouse = getMousePos(e)
}

function ondrag(e: MouseEvent) {
  if (!dragging) return
  const currentMouse = getMousePos(e)
  const dx = (currentMouse.x - lastMouse.x) / camera.value.zoom
  const dy = (currentMouse.y - lastMouse.y) / camera.value.zoom
  camera.value.x -= dx
  camera.value.y -= dy
  lastMouse = currentMouse
  draw()
}

function endDrag() {
  dragging = false
}

function onwheel(e: WheelEvent) {
  e.preventDefault()

  const rect = canvas.value!.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const worldXBefore = camera.value.x + mouseX / (CELL_SIZE * camera.value.zoom)
  const worldYBefore = camera.value.y + mouseY / (CELL_SIZE * camera.value.zoom)

  const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
  camera.value.zoom = Math.min(Math.max(camera.value.zoom, 0.1), 10)

  const worldXAfter = camera.value.x + mouseX / (CELL_SIZE * camera.value.zoom)
  const worldYAfter = camera.value.y + mouseY / (CELL_SIZE * camera.value.zoom)

  camera.value.x += worldXBefore - worldXAfter
  camera.value.y += worldYBefore - worldYAfter

  draw()
}

function draw() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  const zoom = camera.value.zoom
  const offsetX = camera.value.x
  const offsetY = camera.value.y

  const cellScreenSize = CELL_SIZE * zoom

  const canvasWidth = ctx.canvas.width
  const canvasHeight = ctx.canvas.height

  const startCol = Math.floor(offsetX)
  const startRow = Math.floor(offsetY)

  const endCol = Math.ceil(offsetX + canvasWidth / cellScreenSize)
  const endRow = Math.ceil(offsetY + canvasHeight / cellScreenSize)

  for (let i = startCol; i < endCol; i++) {
    for (let j = startRow; j < endRow; j++) {
      if (i < 0 || j < 0 || i >= GRID_SIZE || j >= GRID_SIZE) continue

      const screenX = (i - offsetX) * cellScreenSize
      const screenY = (j - offsetY) * cellScreenSize

      ctx.fillStyle = '#ccc'
      ctx.fillRect(screenX, screenY, cellScreenSize, cellScreenSize)

      ctx.strokeStyle = '#eee'
      ctx.strokeRect(screenX, screenY, cellScreenSize, cellScreenSize)
    }
  }
}

onMounted(() => {
  draw()
})
</script>

<style scoped>
canvas {
  border: 1px solid #333;
}
</style>