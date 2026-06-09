<script setup lang="ts">
import { ref } from 'vue'
import { useResumeStore } from './composables/useResumeStore'
import ResumePreview from './components/ResumePreview.vue'
import EditorPanel from './components/EditorPanel.vue'

const { resumeData, saveToStorage } = useResumeStore()

const editorWidth = ref(420)
const isDragging = ref(false)

function onDragStart(e: MouseEvent) {
  isDragging.value = true
  const startX = e.clientX
  const startWidth = editorWidth.value

  function onMouseMove(e: MouseEvent) {
    const delta = startX - e.clientX
    editorWidth.value = Math.max(300, Math.min(800, startWidth + delta))
  }

  function onMouseUp() {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}


</script>

<template>
  <div class="app-layout" :class="{ dragging: isDragging }">
    <div class="preview-pane">
      <ResumePreview :data="resumeData" />
    </div>
    <div class="resize-handle" @mousedown="onDragStart"></div>
    <div class="editor-pane" :style="{ width: editorWidth + 'px' }">
      <EditorPanel :data="resumeData" @save="saveToStorage" />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.app-layout.dragging {
  user-select: none;
  cursor: col-resize;
}

.app-layout.dragging iframe {
  pointer-events: none;
}

.preview-pane {
  flex: 1;
  overflow: hidden;
  background: #f5f5f5;
}

.resize-handle {
  width: 5px;
  cursor: col-resize;
  background: #e0e0e0;
  flex-shrink: 0;
  transition: background 0.15s;
}

.resize-handle:hover,
.app-layout.dragging .resize-handle {
  background: #3498db;
}

.editor-pane {
  flex-shrink: 0;
  overflow: hidden;
}
</style>
