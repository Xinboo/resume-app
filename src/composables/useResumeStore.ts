import { reactive } from 'vue'
import type { ResumeData } from '../types/resume'
import { getDefaultResume } from '../data/defaultResume'

const STORAGE_KEY = 'resume-data'

function loadFromStorage(): ResumeData | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const resumeData = reactive<ResumeData>(loadFromStorage() ?? getDefaultResume())

export function useResumeStore() {
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
  }
  return { resumeData, saveToStorage }
}
