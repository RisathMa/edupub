import React from 'react';
import { Quiz, UserAnswer } from '@/types/quiz';
import { QuestionCard } from './QuestionCard';
import { FileText, Clock, Award } from 'lucide-react';

interface QuizDisplayProps {
  quiz: Quiz;
  userAnswers: UserAnswer[];
  onSelectAnswer: (questionId: number, optionIndex: number) => void;
  showResults?: boolean;
  examMode?: boolean;
}

export const QuizDisplay: React.FC<QuizDisplayProps> = ({
  quiz,
  userAnswers,
  onSelectAnswer,
  showResults = false,
  examMode = true,
}) => {
  const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-card border-2 border-border rounded-xl p-6 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {quiz.quiz_metadata.title}
            </h2>
            <p className="text-muted-foreground mt-1">
              {quiz.quiz_metadata.subject} • {quiz.quiz_metadata.academic_level}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-accent rounded-lg">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {quiz.quiz_metadata.total_questions} Questions
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-accent rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {quiz.quiz_metadata.duration_minutes} mins
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-accent rounded-lg">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {totalMarks} Marks
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <QuestionCard
            key={question.question_id}
            question={question}
            index={index}
            userAnswer={userAnswers.find(a => a.questionId === question.question_id)}
            onSelectAnswer={onSelectAnswer}
            showResults={showResults}
            examMode={examMode}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizDisplay;
