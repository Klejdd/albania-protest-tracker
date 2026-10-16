export type UserProfile = {
  location: 'albania' | 'abroad'
  hasProtested: boolean
  age: number
  universityMajor?: string
  educationStatus: 'high_school' | 'in_progress' | 'finished'
  plannedMajor?: string
  currentJob?: string
  hasJob?: boolean
  worksForGovernment?: boolean
}

export type ProtestAnswer = {
  protestGoals: string[]
}

export type Comment = {
  id: string
  user_id: string
  comment: string
  created_at: string
  nickname: string
}

export type DashboardStats = {
  totalResponses: number
  locationBreakdown: { location: string; count: number }[]
  educationBreakdown: { education: string; count: number }[]
  jobBreakdown: { category: string; count: number }[]
  goalsFrequency: { goal: string; count: number }[]
  ageDistribution: { ageRange: string; count: number }[]
}
