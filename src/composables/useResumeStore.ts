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

function mergeWithDefaults(stored: ResumeData): ResumeData {
  const defaults = getDefaultResume()
  return {
    ...defaults,
    ...stored,
    personalInfo: { ...defaults.personalInfo, ...stored.personalInfo },
    jobIntention: { ...defaults.jobIntention, ...stored.jobIntention },
  }
}

const stored = loadFromStorage()
const resumeData = reactive<ResumeData>(stored ? mergeWithDefaults(stored) : getDefaultResume())

export function useResumeStore() {
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
  }
  return { resumeData, saveToStorage }
}
