require('dotenv').config();

async function testAPIKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('API Key:', apiKey.substring(0, 20) + '...');
  console.log('\nTesting API key with direct HTTP request...\n');

  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
  ];

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Say hello'
            }]
          }]
        })
      });

      if (response.ok) {
        console.log(`✓ ${model} - WORKING`);
        const data = await response.json();
        console.log('  Response:', data.candidates[0].content.parts[0].text.substring(0, 50));
      } else {
        const error = await response.json();
        console.log(`✗ ${model} - ${response.status} ${error.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`✗ ${model} - Network error:`, error.message);
    }
  }
}

testAPIKey();
