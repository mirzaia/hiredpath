import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Service for Job Description Analysis (Lazy Loading Pattern)
 */

const SKELETON_PROMPT = `You are an expert curriculum designer. 
Extract the core technical requirements from the provided Job Description and generate a high-level interview prep roadmap.

Respond strictly in valid JSON matching this schema:
[
  {
    "id": "module-id-slug",
    "title": "Module Title",
    "subtitle": "Short subtitle",
    "icon": "🚀",
    "color": "#3b82f6",
    "gradient": "from-blue-500 to-cyan-600",
    "topics": [
      {
        "id": "topic-id-slug",
        "title": "Topic Name",
        "summary": "Short topic summary",
        "contentGenerated": false
      }
    ]
  }
]

Requirements:
1. Create 3 to 5 modules.
2. Each module should have 2 to 4 topics depending on the JD complexity.
3. Keep it purely structural (no theory, scenarios, or questions yet).
4. Provide valid JSON only. NO explanations or markdown blocks in output.`;

const DETAILS_PROMPT = `You are a Senior SDET mentoring an engineer based on a specific Job Description.
Your task is to generate the deep technical content (Theory, Scenarios, Questions) for ONE specific topic from their roadmap.

Respond strictly in valid JSON matching this schema:
{
  "theory": "Markdown formatted theory. Use **bold**, \`code\` and bullet points. Minimum 2 paragraphs.",
  "scenarios": [
    {
      "id": "scenario-1",
      "title": "Scenario Name",
      "difficulty": "medium",
      "description": "A real-world SDET architectural or coding scenario problem based strictly on the JD requirements.",
      "hints": ["Hint 1"],
      "answer": "The intended approach or architecture."
    }
  ],
  "questions": [
    {
      "id": "q1",
      "question": "A tough technical interview question.",
      "answer": "The detailed answer."
    }
  ]
}

Requirements:
1. Provide valid JSON only. NO explanations or markdown block ticks wrapping the JSON.
2. Generate 1 to 2 scenarios and 2 to 3 questions.`;

const safeParseJSON = (text) => {
  const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
};

export const generateRoadmapSkeleton = async (apiKey, jdText) => {
  if (!apiKey) throw new Error('API Key is required');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: SKELETON_PROMPT
    });

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        responseMimeType: 'application/json',
      },
      history: [],
    });

    const result = await chatSession.sendMessage(jdText);
    const parsedData = safeParseJSON(result.response.text());
    
    if (!Array.isArray(parsedData)) {
      throw new Error('AI returned invalid format: Expected an array of modules.');
    }
    return parsedData;
  } catch (error) {
    console.error('Failed to generate skeleton:', error);
    throw new Error(error.message || 'Failed to analyze Job Description.');
  }
};

export const generateTopicDetails = async (apiKey, jdText, moduleTitle, topicTitle) => {
  if (!apiKey) throw new Error('API Key is required');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: DETAILS_PROMPT
    });

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        responseMimeType: 'application/json',
      },
      history: [],
    });

    const contextualPrompt = `
      JOB DESCRIPTION: 
      ---
      ${jdText}
      ---
      
      Generate details for:
      Module: ${moduleTitle}
      Topic: ${topicTitle}
    `;

    const result = await chatSession.sendMessage(contextualPrompt);
    const parsedData = safeParseJSON(result.response.text());
    
    if (!parsedData.theory || !parsedData.questions) {
      throw new Error('AI returned invalid topic content structure.');
    }
    return parsedData;
  } catch (error) {
    console.error('Failed to generate topic details:', error);
    throw new Error(error.message || 'Failed to generate topic details.');
  }
};
