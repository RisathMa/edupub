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
      <div className="container mx-auto px-4 h-16 grid grid-cols-3 items-center">
        {/* Left Column - Empty for balance or could be menu later */}
        <div className="hidden md:block"></div>

        {/* Center Column - Logos */}
        <div className="flex items-center justify-center gap-3 col-start-2 justify-self-center w-full">
          <a href="https://www.companyrm.lk" target="_blank" rel="noopener noreferrer" className="block">
            <div className="p-1 bg-white/10 rounded-full overflow-hidden w-10 h-10 border border-white/20 hover:scale-105 transition-transform">
              <img src="/company-logo.png" alt="Company Logo" className="w-full h-full object-cover" />
            </div>
          </a>
          <div className="p-2 bg-primary-foreground/10 rounded-lg">
            <GraduationCap className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-primary-foreground tracking-tight">
              Exam Prep Gen
            </h1>
            <p className="text-xs text-primary-foreground/70">
              AI-Powered Exam Generator
            </p>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="flex items-center justify-end gap-3 col-start-3 justify-self-end">
          {showDownload && onDownload && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden"></span>
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
              {isSubmitting ? 'Submitting...' : <><span className="hidden sm:inline">Submit Exam</span><span className="sm:hidden">Submit</span></>}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
