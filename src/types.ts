/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen = 'SEARCH' | 'DETAIL' | 'DASHBOARD' | 'FOLLOW_UP';

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  appliedDate: string;
  isExternal: boolean;
  isEasyApply: boolean;
  status: 'Applied' | 'Interviewing' | 'No response' | 'Following up';
  daysSinceApplied: number;
  new?: boolean;
}

export interface DailyStats {
  saved: number;
  applied: number;
  external: number;
}

export interface GlobalState {
  dailyStats: DailyStats;
  applications: Application[];
  totalApplications: number;
  dailyGoal: number;
  searchQuery: string;
  selectedJobId: string | null;
  trialDaysLeft: number;
  trialActive: boolean;
  matchScoreVisible: boolean;
}

export interface Job {
  id: string;
  company: string;
  logo: string;
  role: string;
  location: string;
  salary?: string;
  applicants: number;
  posted: string;
  tags: string[];
  isEasyApply: boolean;
  connectionsCount?: number;
  alumniCount?: number;
  benefits?: string[];
  isVerified?: boolean;
  isEarlyApplicant?: boolean;
  highlights?: {
    focus: string;
    team: string;
    challenge: string;
  };
  matchScore?: number;
}
