import { Quiz, ExamConfig } from '@/types/quiz';



export const generateQuiz = async (
  file: File,
  config: ExamConfig,
  apiKey?: string
): Promise<Quiz> => {
  // Use provided key or fallback to env var
  const effectiveApiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (!effectiveApiKey) {
    throw new Error('No API key provided. Please configure VITE_GEMINI_API_KEY in .env file.');
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(effectiveApiKey);

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

    const modelsToTry = [
      { name: 'gemini-2.5-flash', useSystemInstruction: true },
      { name: 'gemini-2.0-flash', useSystemInstruction: true },
      { name: 'gemini-1.5-flash', useSystemInstruction: true },
      { name: 'gemini-1.5-pro', useSystemInstruction: true },
      { name: 'gemini-pro', useSystemInstruction: false } // Fallback for older model support
    ];

    let lastError;

    for (const modelConfig of modelsToTry) {
      try {
        console.log(`Attempting generation with model: ${modelConfig.name}`);

        const modelParams: any = {
          model: modelConfig.name,
        };

        if (modelConfig.useSystemInstruction) {
          modelParams.systemInstruction = `You are a Virtual Pedagogical Expert for the Sri Lankan Curriculum. 
Generate content EXCLUSIVELY in the requested language. 
If Sinhala, use formal 'Misra' Sinhala. 
Balance cognitive levels (Bloom's Taxonomy: Remember, Understand, Apply, Analyze, Evaluate, Create).
For mathematical expressions, use LaTeX format enclosed in $ delimiters.
IMPORTANT: In JSON strings, use double backslashes for LaTeX commands (e.g., \\\\frac not \\frac).
Respond ONLY with a valid JSON object matching the schema.`;
        }

        const model = genAI.getGenerativeModel(modelParams);


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

        return JSON.parse(jsonMatch[0]);
      } catch (error: any) {
        console.warn(`Model ${modelConfig.name} failed:`, error);
        lastError = error;

        // If we are at the last model, throw the error
        if (modelsToTry.indexOf(modelConfig) === modelsToTry.length - 1) {
          if (lastError.message?.includes('404') || lastError.message?.includes('not found')) {
            throw new Error('Gemini API Error: All models (Flash, Pro, 2.0) failed. Please check your API Key permissions in AI Studio.');
          }
          throw lastError;
        }
        // Otherwise loop continues to next model
      }
    }

    throw new Error('Unexpected error: No models success');

  } catch (error) {
    console.error('Final error in generateQuiz:', error);
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
