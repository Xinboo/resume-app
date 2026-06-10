import type { ResumeData } from '../types/resume'

export function getDefaultResume(): ResumeData {
  return {
    personalInfo: {
      name: '',
      gender: '男',
      birthYear: 2000,
      birthMonth: 1,
      workYears: 0,
      phone: '',
      email: '',
      politicalStatus: '普通公民',
      currentCity: '',
    },
    strengths: '',
    jobIntention: {
      targetPositions: '',
      targetCities: '',
      salaryRange: '',
      industry: '',
      jobType: '全职',
      jobStatus: '',
      availability: '',
    },
    workExperience: [],
    projectExperience: [],
    education: [],
    skills: [],
    personalWorks: [],
  }
}
