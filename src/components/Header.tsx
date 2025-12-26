import React from 'react';
import { GraduationCap, FileDown, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  showSubmit?: boolean;
  showDownload?: boolean;
  onSubmit?: () => void;
  onDownload?: (type: 'questions' | 'full') => void;
  isSubmitting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  showSubmit = false,
  showDownload = false,
  onSubmit,
  onDownload,
  isSubmitting = false,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full gradient-hero border-b border-primary/20 shadow-medium">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/10 rounded-lg">
            <GraduationCap className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground tracking-tight">
              Exam Prep Gen
            </h1>
            <p className="text-xs text-primary-foreground/70">
              AI-Powered Exam Generator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showDownload && onDownload && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDownload('questions')}>
                  Question Paper Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload('full')}>
                  Paper + Answers
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {showSubmit && onSubmit && (
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              size="sm"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
