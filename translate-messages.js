const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAuVihIsbZwpDGRAOjwlDtjdcRLNY8-vWg');

const languages = {
  'ta': 'Tamil',
  'hi': 'Hindi',
  'te': 'Telugu',
  'ml': 'Malayalam',
  'kn': 'Kannada'
};

async function translateJSON(enJSON, targetLanguage) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const prompt = `Translate this JSON file from English to ${targetLanguage}. 
IMPORTANT RULES:
1. Keep all JSON keys EXACTLY the same (don't translate keys, only values)
2. Translate ONLY the string values
3. Keep placeholders like {step}, {0}, etc. EXACTLY as they are
4. Keep special characters like ₹, ✕ unchanged
5. Return ONLY the translated JSON, no explanation
6. Make translations natural and culturally appropriate for Indian ${targetLanguage} speakers
7. For financial terms, use commonly understood words in ${targetLanguage}

English JSON:
${JSON.stringify(enJSON, null, 2)}

Translated ${targetLanguage} JSON:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (in case AI adds extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error(`Error translating to ${targetLanguage}:`, error);
    throw error;
  }
}

async function main() {
  console.log('Starting translation process...\n');
  
  // Read English JSON
  const enPath = path.join(__dirname, 'src', 'i18n', 'messages', 'en.json');
  const enJSON = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  // Translate to each language
  for (const [code, name] of Object.entries(languages)) {
    console.log(`Translating to ${name} (${code})...`);
    try {
      const translated = await translateJSON(enJSON, name);
      const outputPath = path.join(__dirname, 'src', 'i18n', 'messages', `${code}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2), 'utf8');
      console.log(`✓ ${name} translation saved\n`);
      
      // Wait a bit between requests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`✗ Failed to translate ${name}:`, error.message, '\n');
    }
  }
  
  console.log('Translation complete!');
}

main().catch(console.error);
