// Interview State Management Types for Milestone 1

export type InterviewState = 
  | 'created'           // Candidate marked ready in ATS
  | 'slots_generated'   // Smart link created with available slots
  | 'slot_confirmed'    // Candidate selected slot, VC link generated
  | 'notified'         // Invites sent to all parties
  | 'in_progress'      // Interview started, both parties joined
  | 'no_show'          // One/both parties failed to join
  | 'rescheduled'      // Moved to new time
  | 'completed'        // Interview ended, feedback pending
  | 'closed'           // Feedback received, process complete

export interface InterviewSlot {
  id: string;
  date: string;
  time: string;
  duration_mins: number;
  timezone: string;
  available_panelists: string[];
  conflict_score: number; // 0-1, lower is better
}

export interface SmartLink {
  id: string;
  interview_id: string;
  candidate_id: string;
  expires_at: string;
  slots: InterviewSlot[];
  selected_slot_id?: string;
  confirmation_token: string;
}

export interface InterviewEvent {
  id: string;
  interview_id: string;
  state: InterviewState;
  timestamp: string;
  triggered_by: 'system' | 'candidate' | 'recruiter' | 'ats';
  metadata?: Record<string, any>;
}

export interface CalendarIntegration {
  provider: 'google' | 'outlook';
  event_id?: string;
  vc_link?: string;
  vc_provider: 'zoom' | 'google_meet' | 'teams';
  attendees: {
    email: string;
    status: 'pending' | 'accepted' | 'declined';
    join_time?: string;
  }[];
}

export interface EnhancedInterview {
  id: string;
  candidate_id: string;
  job_id: string;
  stage_name: string;
  workflow_stage_id: string;
  
  // State Management
  current_state: InterviewState;
  state_history: InterviewEvent[];
  
  // Scheduling Details
  interviewers: string[];
  backup_interviewers?: string[];
  duration_mins: number;
  mode: string;
  
  // Smart Link & Confirmation
  smart_link?: SmartLink;
  selected_slot?: InterviewSlot;
  
  // Calendar & VC Integration
  calendar_integration?: CalendarIntegration;
  
  // Timing
  created_at: string;
  scheduled_time?: string;
  confirmed_at?: string;
  completed_at?: string;
  
  // Metadata
  priority_score?: number;
  urgency_flag?: boolean;
  timezone: string;
  notes?: string;
}