import React from 'react';
import { CheckCircle2, XCircle, HelpCircle, Lightbulb, Image as ImageIcon } from 'lucide-react';
import { SmartText } from './SmartText';
import { Question, UserAnswer } from '@/types/quiz';

interface QuestionCardProps {
  question: Question;
  index: number;
  userAnswer?: UserAnswer;
  onSelectAnswer?: (questionId: number, optionIndex: number) => void;
  showResults?: boolean;
  examMode?: boolean;
}

const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

const getCognitiveLevelColor = (level: string) => {
  switch (level) {
    case 'Remember':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    case 'Understand':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'Apply':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Analyze':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
    case 'Evaluate':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
    case 'Create':
      return 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  userAnswer,
  onSelectAnswer,
  showResults = false,
  examMode = false,
}) => {
  const selectedIndex = userAnswer?.selectedIndex ?? null;
  const isCorrect = showResults && selectedIndex === question.correct_answer_index;
  const isWrong = showResults && selectedIndex !== null && selectedIndex !== question.correct_answer_index;

  return (
    <div
      className={`
        bg-card border-2 rounded-xl p-6 transition-all duration-300
        ${showResults 
          ? isCorrect 
            ? 'border-success bg-success/5' 
            : isWrong 
              ? 'border-destructive bg-destructive/5' 
              : 'border-border'
          : 'border-border hover:border-primary/30'
        }
      `}
    >
      {/* Question Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            {index + 1}
          </span>
          <div className="space-y-2">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getCognitiveLevelColor(question.cognitive_level)}`}>
              {question.cognitive_level}
            </span>
            <p className="text-sm text-muted-foreground">
              {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
            </p>
          </div>
        </div>
        {showResults && (
          <div className="flex-shrink-0">
            {isCorrect ? (
              <CheckCircle2 className="h-6 w-6 text-success" />
            ) : isWrong ? (
              <XCircle className="h-6 w-6 text-destructive" />
            ) : (
              <HelpCircle className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
        )}
      </div>

      {/* Question Stem */}
      <div className="mb-6">
        <SmartText text={question.stem} className="text-foreground leading-relaxed" />
      </div>

      {/* Question Image */}
      {question.image_url && (
        <div className="mb-6 flex justify-center">
          <img
            src={question.image_url}
            alt={`Diagram for question ${index + 1}`}
            className="max-w-full max-h-64 rounded-lg border border-border"
          />
        </div>
      )}

      {question.image_description && !question.image_url && (
        <div className="mb-6 p-4 bg-accent/50 rounded-lg border border-border flex items-center gap-3">
          <ImageIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground italic">
            Image loading: {question.image_description}
          </p>
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedIndex === optionIndex;
          const isCorrectAnswer = optionIndex === question.correct_answer_index;
          const showAsCorrect = showResults && isCorrectAnswer;
          const showAsWrong = showResults && isSelected && !isCorrectAnswer;

          return (
            <button
              key={optionIndex}
              onClick={() => examMode && onSelectAnswer?.(question.question_id, optionIndex)}
              disabled={!examMode || showResults}
              className={`
                w-full flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all duration-200
                ${showAsCorrect 
                  ? 'border-success bg-success/10 text-success'
                  : showAsWrong 
                    ? 'border-destructive bg-destructive/10 text-destructive'
                    : isSelected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }
                ${(!examMode || showResults) ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <span
                className={`
                  flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-semibold text-sm
                  ${showAsCorrect 
                    ? 'bg-success text-success-foreground'
                    : showAsWrong 
                      ? 'bg-destructive text-destructive-foreground'
                      : isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                  }
                `}
              >
                {optionLabels[optionIndex]}
              </span>
              <SmartText text={option} className="flex-1 pt-0.5" />
            </button>
          );
        })}
      </div>

      {/* Explanation (shown after results) */}
      {showResults && (
        <div className="mt-6 p-4 bg-accent rounded-lg border border-border">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm mb-1">Pedagogical Feedback</p>
              <SmartText text={question.explanation} className="text-sm text-muted-foreground" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
