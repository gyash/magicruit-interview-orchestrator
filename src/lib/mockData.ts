export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  status: 'active' | 'paused' | 'closed';
}

export interface WorkflowStage {
  id: string;
  stage_name: string;
  interviewers: string[];
  backup_interviewers?: string[];
  duration_mins: number;
  mode: 'Google Meet' | 'Zoom' | 'Phone' | 'In-person';
  buffer_before_mins: number;
  buffer_after_mins: number;
  notes?: string;
  isATSGenerated?: boolean;
}

export interface Workflow {
  job_id: string;
  stages: WorkflowStage[];
  created_at: string;
  updated_at: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  status: 'screening' | 'interviewing' | 'offer' | 'rejected';
}

export interface Interview {
  id: string;
  job_id: string;
  candidate_id: string;
  stage_name: string;
  interviewers: string[];
  scheduled_time: string;
  duration_mins: number;
  video_mode: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  calendar_event_id?: string;
  notes?: string;
}

export interface Interviewer {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  availability_score: number; // 0-100
}

// Mock data
export const mockJobs: Job[] = [
  {
    id: 'job-001',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    status: 'active'
  },
  {
    id: 'job-002',
    title: 'Product Manager',
    department: 'Product',
    location: 'San Francisco',
    status: 'active'
  },
  {
    id: 'job-003',
    title: 'UX Designer',
    department: 'Design',
    location: 'New York',
    status: 'paused'
  }
];

export const mockInterviewers: Interviewer[] = [
  {
    id: 'int-001',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    department: 'Engineering',
    role: 'Senior Engineer',
    availability_score: 85
  },
  {
    id: 'int-002',
    name: 'Bob Smith',
    email: 'bob@company.com',
    department: 'Engineering',
    role: 'Tech Lead',
    availability_score: 72
  },
  {
    id: 'int-003',
    name: 'Carol Davis',
    email: 'carol@company.com',
    department: 'Product',
    role: 'Sr. PM',
    availability_score: 90
  },
  {
    id: 'int-004',
    name: 'David Wilson',
    email: 'david@company.com',
    department: 'Design',
    role: 'Design Lead',
    availability_score: 78
  },
  {
    id: 'int-005',
    name: 'Emma Brown',
    email: 'emma@company.com',
    department: 'HR',
    role: 'Recruiter',
    availability_score: 95
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: 'cand-001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123',
    position: 'Senior Software Engineer',
    status: 'interviewing'
  },
  {
    id: 'cand-002',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1-555-0124',
    position: 'Product Manager',
    status: 'screening'
  },
  {
    id: 'cand-003',
    name: 'Michael Johnson',
    email: 'mike.johnson@email.com',
    position: 'UX Designer',
    status: 'offer'
  }
];

export const mockInterviews: Interview[] = [
  {
    id: 'int-001',
    job_id: 'job-001',
    candidate_id: 'cand-001',
    stage_name: 'Tech Round',
    interviewers: ['alice@company.com', 'bob@company.com'],
    scheduled_time: '2025-01-15T14:00:00Z',
    duration_mins: 60,
    video_mode: 'Google Meet',
    status: 'scheduled',
    notes: 'Focus on system design and coding'
  },
  {
    id: 'int-002',
    job_id: 'job-002',
    candidate_id: 'cand-002',
    stage_name: 'Recruiter Screen',
    interviewers: ['emma@company.com'],
    scheduled_time: '2025-01-14T10:00:00Z',
    duration_mins: 30,
    video_mode: 'Google Meet',
    status: 'completed'
  },
  {
    id: 'int-003',
    job_id: 'job-001',
    candidate_id: 'cand-001',
    stage_name: 'Final Round',
    interviewers: ['carol@company.com'],
    scheduled_time: '2025-01-16T15:30:00Z',
    duration_mins: 45,
    video_mode: 'Zoom',
    status: 'pending'
  }
];

export const mockWorkflows: Workflow[] = [
  {
    job_id: 'job-001',
    stages: [
      {
        id: 'stage-001',
        stage_name: 'Recruiter Screen',
        interviewers: ['emma@company.com'],
        duration_mins: 30,
        mode: 'Google Meet',
        buffer_before_mins: 5,
        buffer_after_mins: 5,
        notes: 'Initial screening call'
      },
      {
        id: 'stage-002',
        stage_name: 'Tech Round',
        interviewers: ['alice@company.com', 'bob@company.com'],
        backup_interviewers: ['david@company.com'],
        duration_mins: 60,
        mode: 'Google Meet',
        buffer_before_mins: 10,
        buffer_after_mins: 10,
        notes: 'Technical assessment and coding'
      },
      {
        id: 'stage-003',
        stage_name: 'Final Round',
        interviewers: ['carol@company.com'],
        duration_mins: 45,
        mode: 'Zoom',
        buffer_before_mins: 5,
        buffer_after_mins: 15,
        notes: 'Culture fit and leadership discussion'
      }
    ],
    created_at: '2025-01-10T09:00:00Z',
    updated_at: '2025-01-12T14:30:00Z'
  }
];

// Utility functions
export const getJobById = (id: string): Job | undefined => {
  return mockJobs.find(job => job.id === id);
};

export const getInterviewerByEmail = (email: string): Interviewer | undefined => {
  return mockInterviewers.find(interviewer => interviewer.email === email);
};

export const getCandidateById = (id: string): Candidate | undefined => {
  return mockCandidates.find(candidate => candidate.id === id);
};

export const getWorkflowByJobId = (jobId: string): Workflow | undefined => {
  return mockWorkflows.find(workflow => workflow.job_id === jobId);
};

export const getInterviewsByStatus = (status: Interview['status']): Interview[] => {
  return mockInterviews.filter(interview => interview.status === status);
};

export const formatInterviewerName = (email: string): string => {
  const interviewer = getInterviewerByEmail(email);
  return interviewer ? interviewer.name : email;
};