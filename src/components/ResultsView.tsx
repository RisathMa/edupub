import React from 'react';
import { Trophy, Target, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExamResult, Quiz } from '@/types/quiz';

interface ResultsViewProps {
  result: ExamResult;
  quiz: Quiz;
  onRetake: () => void;
  onNewExam: () => void;
}

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'text-success';
    case 'B+':
    case 'B':
      return 'text-primary';
    case 'C+':
    case 'C':
      return 'text-warning';
    default:
      return 'text-destructive';
  }
};

const getGradeMessage = (score: number): string => {
  if (score >= 90) return 'Outstanding Performance!';
  if (score >= 80) return 'Excellent Work!';
  if (score >= 70) return 'Good Job!';
  if (score >= 60) return 'Keep Practicing!';
  if (score >= 50) return 'Room for Improvement';
  return 'More Study Needed';
};

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  quiz,
  onRetake,
  onNewExam,
}) => {
  const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
  const earnedMarks = quiz.questions.reduce((sum, q) => {
    const answer = result.answers.find(a => a.questionId === q.question_id);
    return sum + (answer?.selectedIndex === q.correct_answer_index ? q.marks : 0);
  }, 0);

  return (
    <div className="bg-card border-2 border-border rounded-xl p-8 shadow-medium">
      {/* Score Circle */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-secondary"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - result.score / 100)}`}
              strokeLinecap="round"
              className={getGradeColor(result.grade)}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getGradeColor(result.grade)}`}>
              {result.score}%
            </span>
            <span className={`text-2xl font-bold ${getGradeColor(result.grade)}`}>
              {result.grade}
            </span>
          </div>
        </div>
        <p className="text-xl font-semibold mt-4 text-foreground">
          {getGradeMessage(result.score)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-accent rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Correct Answers</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {result.correctAnswers} / {result.totalQuestions}
          </p>
        </div>
        <div className="bg-accent rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Marks Earned</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {earnedMarks} / {totalMarks}
          </p>
        </div>
        <div className="bg-accent rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {((result.correctAnswers / result.totalQuestions) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onRetake}
          variant="outline"
          className="flex-1 h-12 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retake Exam
        </Button>
        <Button
          onClick={onNewExam}
          className="flex-1 h-12 gap-2"
        >
          Generate New Exam
        </Button>
      </div>
    </div>
  );
};

export default ResultsView;
