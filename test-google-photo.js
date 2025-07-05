// Test script to verify Google photo proxy functionality
const fetch = require('node-fetch');

async function testGooglePhotoProxy() {
  const testUrl = 'https://lh3.googleusercontent.com/a/default-user';
  const proxyUrl = `http://localhost:5000/api/proxy/google-photo?url=${encodeURIComponent(testUrl)}`;
  
  try {
    console.log('Testing Google photo proxy...');
    console.log('Original URL:', testUrl);
    console.log('Proxy URL:', proxyUrl);
    
    const response = await fetch(proxyUrl);
    
    if (response.ok) {
      console.log('✅ Proxy working! Status:', response.status);
      console.log('Content-Type:', response.headers.get('content-type'));
      console.log('Content-Length:', response.headers.get('content-length'));
    } else {
      console.log('❌ Proxy failed! Status:', response.status);
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Run the test
testGooglePhotoProxy(); 