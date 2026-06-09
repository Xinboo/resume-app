export interface PersonalInfo {
  name: string
  gender: string
  birthYear: number
  birthMonth: number
  workYears: number
  phone: string
  email: string
  politicalStatus: string
  currentCity: string
}

export interface JobIntention {
  targetPositions: string
  targetCities: string
  salaryRange: string
  industry: string
  jobType: string
  jobStatus: string
  availability: string
}

export interface WorkEntry {
  id: string
  logo: string
  company: string
  startDate: string
  endDate: string
  isCurrentJob: boolean
  role: string
  industry: string
  companySize: string
  companyType: string
  description: string
}

export interface ProjectEntry {
  id: string
  name: string
  startDate: string
  endDate: string
  isCurrentProject: boolean
  company: string
  link: string
  description: string
}

export interface EducationEntry {
  id: string
  logo: string
  school: string
  startDate: string
  endDate: string
  degree: string
  major: string
}

export type SkillLevel = '精通' | '熟练' | '良好' | '一般'

export interface SkillEntry {
  id: string
  name: string
  level: SkillLevel
}

export interface PersonalWork {
  id: string
  link: string
  description: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  strengths: string
  jobIntention: JobIntention
  workExperience: WorkEntry[]
  projectExperience: ProjectEntry[]
  education: EducationEntry[]
  skills: SkillEntry[]
  personalWorks: PersonalWork[]
}
