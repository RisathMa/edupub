import React from 'react';
import { Settings, BookOpen, Languages, Target, Hash } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExamConfig } from '@/types/quiz';

interface ConfigPanelProps {
  config: ExamConfig;
  onConfigChange: (config: ExamConfig) => void;
  disabled?: boolean;
}

const academicLevels = [
  { label: 'Grade 1', value: 'Grade 1' },
  { label: 'Grade 2', value: 'Grade 2' },
  { label: 'Grade 3', value: 'Grade 3' },
  { label: 'Grade 4', value: 'Grade 4' },
  { label: 'Grade 5', value: 'Grade 5' },
  { label: 'Grade 6', value: 'Grade 6' },
  { label: 'Grade 7', value: 'Grade 7' },
  { label: 'Grade 8', value: 'Grade 8' },
  { label: 'Grade 9', value: 'Grade 9' },
  { label: 'Grade 10', value: 'Grade 10' },
  { label: 'Grade 11', value: 'Grade 11' },
  { label: 'Grade 12', value: 'Grade 12' },
  { label: 'Grade 13', value: 'Grade 13' },
  { label: 'GCE O/L', value: 'GCE O/L' },
  { label: 'GCE A/L', value: 'GCE A/L' },
];

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onConfigChange,
  disabled = false,
}) => {
  const updateConfig = (updates: Partial<ExamConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const ConfigContent = () => (
    <div className="space-y-6">
      {/* Academic Level */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <BookOpen className="h-4 w-4 text-primary" />
          Academic Level
        </Label>
        <div className="flex flex-wrap gap-2">
          {academicLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => updateConfig({ academicLevel: level.value })}
              disabled={disabled}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all duration-200
                ${
                  config.academicLevel === level.value
                    ? 'border-primary bg-primary text-primary-foreground shadow-soft'
                    : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Languages className="h-4 w-4 text-primary" />
          Language
        </Label>
        <div className="flex gap-2">
          {(['English', 'Sinhala'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => updateConfig({ language: lang })}
              disabled={disabled}
              className={`
                flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all duration-200
                ${
                  config.language === lang
                    ? 'border-primary bg-primary text-primary-foreground shadow-soft'
                    : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {lang === 'Sinhala' ? 'සිංහල' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Question Count */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Hash className="h-4 w-4 text-primary" />
          Number of Questions: {config.questionCount}
        </Label>
        <Slider
          value={[config.questionCount]}
          onValueChange={([value]) => updateConfig({ questionCount: value })}
          min={5}
          max={30}
          step={5}
          disabled={disabled}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>5</span>
          <span>15</span>
          <span>30</span>
        </div>
      </div>

      {/* Focus Topics */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Target className="h-4 w-4 text-primary" />
          Focus Topics (Optional)
        </Label>
        <Textarea
          placeholder="e.g., Algebra, Newton's Laws, Chemical Reactions..."
          value={config.focusTopics}
          onChange={(e) => updateConfig({ focusTopics: e.target.value })}
          disabled={disabled}
          className="min-h-[80px] resize-none bg-card"
        />
        <p className="text-xs text-muted-foreground">
          Specify topics to focus the exam questions on specific areas.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="bg-card border-2 border-border rounded-xl p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Configuration</h2>
          </div>
          <ConfigContent />
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <Accordion type="single" collapsible defaultValue="config">
          <AccordionItem value="config" className="border-2 border-border rounded-xl bg-card">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <span className="font-bold">Configuration</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <ConfigContent />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default ConfigPanel;
