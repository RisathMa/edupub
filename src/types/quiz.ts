export interface QuizMetadata {
  title: string;
  subject: string;
  language: 'English' | 'Sinhala';
  academic_level: string;
  total_questions: number;
  duration_minutes: number;
}

export interface Question {
  question_id: number;
  stem: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
  cognitive_level: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  marks: number;
  image_description?: string;
  image_url?: string;
}

export interface Quiz {
  quiz_metadata: QuizMetadata;
  questions: Question[];
}

export interface ExamConfig {
  academicLevel: string;
  language: 'English' | 'Sinhala';
  focusTopics: string;
  questionCount: number;
}

export interface UserAnswer {
  questionId: number;
  selectedIndex: number | null;
}

export interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  grade: string;
  answers: UserAnswer[];
}
