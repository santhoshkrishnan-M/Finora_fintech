require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAvailableModels() {
  try {
    console.log('Checking available models with current API key...\n');
    
    const models = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-2.0-flash-exp',
      'gemini-exp-1206'
    ];
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        console.log(`✓ ${modelName} - WORKING`);
      } catch (error) {
        console.log(`✗ ${modelName} - NOT AVAILABLE (${error.status || 'error'})`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listAvailableModels();
