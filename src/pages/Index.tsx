import React, { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { ConfigPanel } from '@/components/ConfigPanel';
import { UploadZone } from '@/components/UploadZone';
import { QuizDisplay } from '@/components/QuizDisplay';
import { ResultsView } from '@/components/ResultsView';
import { generateQuiz, calculateGrade } from '@/services/geminiService';
import { generatePDF } from '@/services/pdfService';
import { Quiz, ExamConfig, UserAnswer, ExamResult } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, BookOpen, FileText, Download } from 'lucide-react';

type AppState = 'upload' | 'quiz' | 'results';

const Index = () => {
  const { toast } = useToast();
  
  // Config state
  const [config, setConfig] = useState<ExamConfig>({
    academicLevel: 'Grade 10',
    language: 'English',
    focusTopics: '',
    questionCount: 10,
  });

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Quiz state
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [appState, setAppState] = useState<AppState>('upload');
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please upload a study material to generate an exam.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Generate quiz (demo mode without API key)
      const generatedQuiz = await generateQuiz(file, config);
      setQuiz(generatedQuiz);
      setUserAnswers([]);
      setAppState('quiz');
      toast({
        title: 'Exam Generated!',
        description: `${generatedQuiz.quiz_metadata.total_questions} questions ready.`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation Failed',
        description: 'There was an error generating the exam. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, config, toast]);

  const handleSelectAnswer = useCallback((questionId: number, optionIndex: number) => {
    setUserAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a =>
          a.questionId === questionId ? { ...a, selectedIndex: optionIndex } : a
        );
      }
      return [...prev, { questionId, selectedIndex: optionIndex }];
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!quiz) return;

    const correctAnswers = quiz.questions.filter(q => {
      const answer = userAnswers.find(a => a.questionId === q.question_id);
      return answer?.selectedIndex === q.correct_answer_index;
    }).length;

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const grade = calculateGrade(score);

    setExamResult({
      totalQuestions: quiz.questions.length,
      correctAnswers,
      score,
      grade,
      answers: userAnswers,
    });
    setAppState('results');

    toast({
      title: 'Exam Submitted!',
      description: `You scored ${score}% (${grade})`,
    });
  }, [quiz, userAnswers, toast]);

  const handleDownload = useCallback(async (type: 'questions' | 'full') => {
    if (!quiz) return;

    try {
      await generatePDF(quiz, type === 'full');
      toast({
        title: 'PDF Downloaded',
        description: `Your ${type === 'full' ? 'complete' : 'question'} paper has been downloaded.`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: 'Download Failed',
        description: 'There was an error generating the PDF.',
        variant: 'destructive',
      });
    }
  }, [quiz, toast]);

  const handleRetake = useCallback(() => {
    setUserAnswers([]);
    setExamResult(null);
    setAppState('quiz');
  }, []);

  const handleNewExam = useCallback(() => {
    setQuiz(null);
    setUserAnswers([]);
    setExamResult(null);
    setFile(null);
    setAppState('upload');
  }, []);

  return (
    <div className="min-h-screen gradient-subtle">
      <Header
        showSubmit={appState === 'quiz'}
        showDownload={appState === 'quiz' || appState === 'results'}
        onSubmit={handleSubmit}
        onDownload={handleDownload}
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {appState === 'upload' && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-accent-foreground mb-4">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI-Powered Exam Generation</span>
              </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Transform Study Materials into
              <span className="text-primary"> Exam Papers</span>
            </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your PDFs, images, or videos and let AI generate comprehensive exam papers
                with math notation, diagrams, and instant grading.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                { icon: BookOpen, title: 'Sri Lankan Curriculum', desc: 'Aligned with local standards' },
                { icon: FileText, title: 'Math & Science', desc: 'LaTeX formulas & diagrams' },
                { icon: Download, title: 'PDF Export', desc: 'Download question papers' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card border-2 border-border rounded-xl p-5 text-center shadow-soft">
                  <div className="w-12 h-12 mx-auto mb-3 bg-accent rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ConfigPanel
                  config={config}
                  onConfigChange={setConfig}
                  disabled={isProcessing}
                />
              </div>
              <div className="lg:col-span-2">
                <UploadZone
                  file={file}
                  onFileSelect={setFile}
                  onGenerate={handleGenerate}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          </>
        )}

        {appState === 'quiz' && quiz && (
          <QuizDisplay
            quiz={quiz}
            userAnswers={userAnswers}
            onSelectAnswer={handleSelectAnswer}
            showResults={false}
            examMode={true}
          />
        )}

        {appState === 'results' && quiz && examResult && (
          <div className="space-y-8">
            <ResultsView
              result={examResult}
              quiz={quiz}
              onRetake={handleRetake}
              onNewExam={handleNewExam}
            />
            <QuizDisplay
              quiz={quiz}
              userAnswers={examResult.answers}
              onSelectAnswer={() => {}}
              showResults={true}
              examMode={false}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Exam Prep Gen • AI-Powered Exam Generation for Sri Lankan Curriculum</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
