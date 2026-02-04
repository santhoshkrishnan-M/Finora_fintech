require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAllModels() {
  try {
    console.log('API Key (first 20 chars):', process.env.GEMINI_API_KEY.substring(0, 20) + '...');
    console.log('\nCalling official ListModels API...\n');
    
    const models = await genAI.listModels();
    
    console.log(`Found ${models.length} models:\n`);
    models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Supported: ${model.supportedGenerationMethods.join(', ')}`);
    });
  } catch (error) {
    console.error('Error listing models:', error.message);
    console.error('Status:', error.status);
    console.error('\nThis might indicate:');
    console.error('1. Invalid API key');
    console.error('2. API key not properly activated');
    console.error('3. Billing not enabled on the Google Cloud project');
  }
}

listAllModels();
