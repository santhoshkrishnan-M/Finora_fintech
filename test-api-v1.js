require('dotenv').config();

async function testAPIWithV1() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Testing API Key:', apiKey.substring(0, 25) + '...\n');

  // Test different API versions and models
  const tests = [
    { version: 'v1beta', model: 'gemini-1.5-flash' },
    { version: 'v1beta', model: 'gemini-1.5-pro' },
    { version: 'v1beta', model: 'gemini-pro' },
    { version: 'v1', model: 'gemini-1.5-flash' },
    { version: 'v1', model: 'gemini-1.5-pro' },
    { version: 'v1', model: 'gemini-pro' },
  ];

  for (const test of tests) {
    const url = `https://generativelanguage.googleapis.com/${test.version}/models/${test.model}:generateContent?key=${apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✓ WORKING: ${test.version}/models/${test.model}`);
        console.log(`  Response: ${data.candidates[0].content.parts[0].text.substring(0, 50)}\n`);
        return { version: test.version, model: test.model }; // Return first working combo
      } else {
        const error = await response.text();
        console.log(`✗ ${test.version}/models/${test.model} - ${response.status}`);
      }
    } catch (error) {
      console.log(`✗ ${test.version}/models/${test.model} - ${error.message}`);
    }
  }
  
  console.log('\n❌ No working model found with this API key');
  return null;
}

testAPIWithV1();
