export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  role: UserRole;
  progress_score: number;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  category: string;
  title: string;
  prompt_text: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  created_at: string;
}

export interface Quiz {
  id: string;
  module_level: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string | null;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  selected_option: string;
  is_correct: boolean;
  attempted_at: string;
}

export interface Discussion {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  username?: string;
  reply_count?: number;
}

export interface DiscussionReply {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  created_at: string;
  username?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  badge_icon: string;
  requirement_type: string;
  requirement_value: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export interface UserProgress {
  id: string;
  user_id: string;
  module_name: string;
  completed: boolean;
  completed_at: string | null;
}

export interface PromptFeedback {
  hasSubject: boolean;
  hasStyle: boolean;
  hasDetails: boolean;
  hasQuality: boolean;
  score: number;
  suggestions: string[];
}
