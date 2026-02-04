require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel() {
  try {
    console.log('Testing gemini-1.5-flash-latest model...\n');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent('Say hello in one word');
    const response = await result.response;
    const text = response.text();
    
    console.log('✓ Model WORKS!');
    console.log('Response:', text);
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Status:', error.status);
  }
}

testModel();
