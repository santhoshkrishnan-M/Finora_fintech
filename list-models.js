const https = require('https');

const apiKey = 'AIzaSyAuVihIsbZwpDGRAOjwlDtjdcRLNY8-vWg';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Available models:');
    const response = JSON.parse(data);
    if (response.models) {
      response.models.forEach(model => {
        if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes('generateContent')) {
          console.log(`✓ ${model.name}`);
        }
      });
    } else {
      console.log('Response:', data);
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
