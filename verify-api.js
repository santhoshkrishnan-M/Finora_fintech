require('dotenv').config();

async function verifyAPIKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Testing API Key:', apiKey.substring(0, 25) + '...\n');

  // Try to list available models
  const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(listUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✓ API Key is VALID!\n');
      console.log(`Found ${data.models?.length || 0} models:\n`);
      
      if (data.models && data.models.length > 0) {
        data.models.forEach(model => {
          const name = model.name.replace('models/', '');
          const methods = model.supportedGenerationMethods || [];
          if (methods.includes('generateContent')) {
            console.log(`  ✓ ${name} - supports generateContent`);
          }
        });
      } else {
        console.log('  ⚠ No models available with this API key');
        console.log('  This could mean:');
        console.log('  - API key needs to be activated in Google AI Studio');
        console.log('  - Billing needs to be enabled');
        console.log('  - API access restrictions');
      }
    } else {
      const error = await response.text();
      console.log('✗ API Key ERROR:');
      console.log(`  Status: ${response.status}`);
      console.log(`  Message: ${error}`);
      console.log('\nPossible issues:');
      console.log('  1. Invalid API key format');
      console.log('  2. API key revoked or deleted');
      console.log('  3. API key not created properly');
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

verifyAPIKey();
