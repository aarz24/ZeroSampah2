// Simple script to test Gemini AI API
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testGemini() {
  console.log('🔍 Testing Gemini AI...\n');
  
  // Check if API key exists
  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('\n📝 To fix this:');
    console.log('1. Create a .env file in the root directory');
    console.log('2. Add: GEMINI_API_KEY=your_api_key_here');
    console.log('3. Get your API key from: https://aistudio.google.com/app/apikey');
    return;
  }
  
  console.log('✓ API Key found:', GEMINI_API_KEY.substring(0, 20) + '...');
  
  // Test multiple models (trying Gemini 3 first)
  const modelsToTest = [
    'gemini-exp-1206',  // Latest experimental model
    'gemini-2.5-flash',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
  ];
  
  for (const model of modelsToTest) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 Testing model: ${model}`);
    console.log('='.repeat(60));
    
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      
      const testPayload = {
        contents: [
          {
            parts: [
              {
                text: "Say 'Hello! Gemini AI is working correctly!' in a friendly way."
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      };
      
      console.log('📤 Sending test request...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testPayload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`\n✅ SUCCESS with ${model}!`);
        console.log('📋 Response Status:', response.status);
        
        if (data.candidates && data.candidates[0]?.content?.parts) {
          const aiResponse = data.candidates[0].content.parts[0].text;
          console.log('\n🤖 Gemini Response:');
          console.log('━'.repeat(50));
          console.log(aiResponse);
          console.log('━'.repeat(50));
        }
        
        console.log('\n✓ This model is working! You can use it in your app.');
        break; // Exit loop if successful
      } else {
        console.error(`\n❌ FAILED with ${model}`);
        console.error('Status:', response.status);
        console.error('Error:', data.error?.message || JSON.stringify(data, null, 2));
        
        if (data.error?.code === 400 && data.error?.message?.includes('API Key')) {
          console.log('\n⚠️  API Key Issue Detected!');
          console.log('\n📝 Steps to fix:');
          console.log('1. Go to: https://aistudio.google.com/app/apikey');
          console.log('2. Sign in with your Google account');
          console.log('3. Click "Create API Key"');
          console.log('4. Copy the new API key');
          console.log('5. Update your .env file with: GEMINI_API_KEY=your_new_key');
          console.log('6. Restart the test');
          break; // Stop testing other models
        }
      }
      
    } catch (error) {
      console.error(`\n❌ ERROR testing ${model}:`, error.message);
    }
  }
  
  console.log(`\n${'='.repeat(60)}\n`);
}

// Run the test
testGemini();
