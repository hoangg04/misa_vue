import storage from './storage'
import type { CandidateType } from '@/types/candicates'

export const candidateDataStorage = storage<{ Candidates: CandidateType[] }>('candicateData')
export const sidebarStateStorage = storage<string>('sidebarState')
