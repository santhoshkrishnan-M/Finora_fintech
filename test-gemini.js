const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyAuVihIsbZwpDGRAOjwlDtjdcRLNY8-vWg');

async function testModels() {
  const modelsToTest = [
    'gemini-2.5-flash'
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello');
      const response = await result.response;
      console.log(`✓ ${modelName} WORKS!`);
      console.log(`Response: ${response.text().substring(0, 50)}...\n`);
    } catch (error) {
      console.log(`✗ ${modelName} failed: ${error.message}\n`);
    }
  }
}

testModels();
