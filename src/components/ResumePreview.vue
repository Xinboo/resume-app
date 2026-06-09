<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { ResumeData } from '../types/resume'
import { renderResumeHtml } from '../utils/renderResumeHtml'

const props = defineProps<{ data: ResumeData }>()

const iframeRef = ref<HTMLIFrameElement>()

const htmlContent = computed(() => renderResumeHtml(props.data))

function writeToIframe() {
  const iframe = iframeRef.value
  if (!iframe) return
  const doc = iframe.contentDocument || iframe.contentWindow?.document
  if (!doc) return
  doc.open()
  doc.write(htmlContent.value)
  doc.close()
}

watch(htmlContent, writeToIframe)

onMounted(() => {
  setTimeout(writeToIframe, 50)
})
</script>

<template>
  <iframe ref="iframeRef" class="preview-iframe" />
</template>

<style scoped>
.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #fff;
}
</style>
