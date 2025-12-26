import { Quiz, ExamConfig } from '@/types/quiz';

const DEMO_QUIZ: Quiz = {
  quiz_metadata: {
    title: "Mathematics Assessment",
    subject: "Mathematics",
    language: "English",
    academic_level: "Grade 10",
    total_questions: 5,
    duration_minutes: 30
  },
  questions: [
    {
      question_id: 1,
      stem: "Solve the quadratic equation: $x^2 - 5x + 6 = 0$",
      options: [
        "$x = 2$ or $x = 3$",
        "$x = -2$ or $x = -3$",
        "$x = 1$ or $x = 6$",
        "$x = -1$ or $x = -6$"
      ],
      correct_answer_index: 0,
      explanation: "Using factorization: $x^2 - 5x + 6 = (x-2)(x-3) = 0$. Therefore, $x = 2$ or $x = 3$.",
      cognitive_level: "Apply",
      marks: 2
    },
    {
      question_id: 2,
      stem: "What is the derivative of $f(x) = 3x^2 + 2x - 5$?",
      options: [
        "$f'(x) = 6x + 2$",
        "$f'(x) = 3x + 2$",
        "$f'(x) = 6x^2 + 2$",
        "$f'(x) = 6x - 5$"
      ],
      correct_answer_index: 0,
      explanation: "Using the power rule: $\\frac{d}{dx}(x^n) = nx^{n-1}$. So $f'(x) = 2 \\cdot 3x + 2 = 6x + 2$.",
      cognitive_level: "Understand",
      marks: 2
    },
    {
      question_id: 3,
      stem: "Calculate the area of a circle with radius $r = 7$ cm. (Use $\\pi = \\frac{22}{7}$)",
      options: [
        "$154$ cm²",
        "$44$ cm²",
        "$308$ cm²",
        "$77$ cm²"
      ],
      correct_answer_index: 0,
      explanation: "Area = $\\pi r^2 = \\frac{22}{7} \\times 7^2 = \\frac{22}{7} \\times 49 = 22 \\times 7 = 154$ cm²",
      cognitive_level: "Apply",
      marks: 2
    },
    {
      question_id: 4,
      stem: "Simplify: $\\frac{x^2 - 9}{x + 3}$",
      options: [
        "$x - 3$",
        "$x + 3$",
        "$x^2 - 3$",
        "$\\frac{x - 3}{x + 3}$"
      ],
      correct_answer_index: 0,
      explanation: "Using difference of squares: $x^2 - 9 = (x+3)(x-3)$. So $\\frac{(x+3)(x-3)}{x+3} = x - 3$ (when $x \\neq -3$).",
      cognitive_level: "Analyze",
      marks: 2
    },
    {
      question_id: 5,
      stem: "What is the sum of the first 10 natural numbers?",
      options: [
        "55",
        "45",
        "50",
        "100"
      ],
      correct_answer_index: 0,
      explanation: "Using the formula $S_n = \\frac{n(n+1)}{2}$: $S_{10} = \\frac{10 \\times 11}{2} = 55$",
      cognitive_level: "Remember",
      marks: 2
    }
  ]
};

export const generateQuiz = async (
  file: File,
  config: ExamConfig,
  apiKey?: string
): Promise<Quiz> => {
  // If no API key is provided, return demo quiz
  if (!apiKey) {
    console.log('No API key provided, returning demo quiz');
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      ...DEMO_QUIZ,
      quiz_metadata: {
        ...DEMO_QUIZ.quiz_metadata,
        language: config.language,
        academic_level: config.academicLevel,
        total_questions: config.questionCount
      }
    };
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are a Virtual Pedagogical Expert for the Sri Lankan Curriculum. 
Generate content EXCLUSIVELY in the requested language. 
If Sinhala, use formal 'Misra' Sinhala. 
Balance cognitive levels (Bloom's Taxonomy: Remember, Understand, Apply, Analyze, Evaluate, Create).
For mathematical expressions, use LaTeX format enclosed in $ delimiters.
IMPORTANT: In JSON strings, use double backslashes for LaTeX commands (e.g., \\\\frac not \\frac).
Respond ONLY with a valid JSON object matching the schema.`
    });

    // Convert file to base64
    const base64Data = await fileToBase64(file);
    const mimeType = file.type || 'application/octet-stream';

    const prompt = `Analyze this study material and generate an exam paper with the following specifications:

Academic Level: ${config.academicLevel}
Language: ${config.language}
Number of Questions: ${config.questionCount}
${config.focusTopics ? `Focus Topics: ${config.focusTopics}` : ''}

Generate a JSON response with this exact schema:
{
  "quiz_metadata": {
    "title": "string - exam title",
    "subject": "string - detected subject",
    "language": "${config.language}",
    "academic_level": "${config.academicLevel}",
    "total_questions": ${config.questionCount},
    "duration_minutes": number
  },
  "questions": [
    {
      "question_id": number,
      "stem": "string - question text with LaTeX math in $...$",
      "options": ["option A", "option B", "option C", "option D"],
      "correct_answer_index": 0-3,
      "explanation": "string - pedagogical explanation",
      "cognitive_level": "Remember|Understand|Apply|Analyze|Evaluate|Create",
      "marks": 1-5,
      "image_description": "optional - description for diagram if needed"
    }
  ]
}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const quiz: Quiz = JSON.parse(jsonMatch[0]);
    return quiz;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateImage = async (
  description: string,
  apiKey: string
): Promise<string | null> => {
  // Image generation would require a different model/API
  // For now, return null and images will show as placeholders
  console.log('Image generation requested:', description);
  return null;
};

export const calculateGrade = (score: number): string => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C+';
  if (score >= 40) return 'C';
  if (score >= 30) return 'D';
  return 'F';
};
