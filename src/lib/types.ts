export interface Quiz {
  id: string;
  created_at?: string;
  title: string;
  domain: string;
  active_from: string;
  active_until: string;
  admin_id: string;
}

export interface Question {
  id: string;
  created_at?: string;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  time_limit_seconds: number;
}

export interface Result {
  id?: string;
  created_at?: string;
  quiz_id: string;
  candidate_name: string;
  score: number;
  total_questions: number;
  answers: any[];
  tab_switch_count: number;
}