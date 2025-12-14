import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testGeminiDirect() {
  console.log('🧪 Testing Gemini 2.5 Flash API directly...\n');
  
  if (!GEMINI_API_KEY) {
    console.error('❌ No API key found');
    return;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
      contents: [
        {
          parts: [
            {
              text: "Say 'Gemini 2.5 Flash is working!' briefly"
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100
      }
    };

    console.log('📤 Sending request to Gemini 2.5 Flash...\n');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));

    if (response.ok && data.candidates) {
      console.log('\n✅ SUCCESS! API is working!');
      console.log('💬 Response:', data.candidates[0]?.content?.parts[0]?.text);
    } else {
      console.log('\n❌ FAILED!');
      console.log('Error:', data.error?.message || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGeminiDirect();
