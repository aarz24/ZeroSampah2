// Test Gemini API key
const API_KEY = "AIzaSyD8AvKTWRfgPpA1TGDzMdmWpo45RRIUG94";

async function testGemini() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: "Say hello in one word" }]
        }]
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', result);
      console.error('Status:', response.status);
      console.error('Message:', result.error?.message);
    } else {
      console.log('✅ API Key works!');
      console.log('Response:', result.candidates[0].content.parts[0].text);
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

testGemini();
