const fetch = require('node-fetch');

async function testAuth() {
  const baseUrl = 'http://localhost:5001';
  
  console.log('Testing authentication flow...\n');
  
  // Test 1: Check if server is running
  try {
    const healthCheck = await fetch(`${baseUrl}/`);
    console.log('✅ Server is running');
  } catch (error) {
    console.log('❌ Server is not running:', error.message);
    return;
  }
  
  // Test 2: Try to access /me without authentication
  try {
    const meResponse = await fetch(`${baseUrl}/api/auth/me`, {
      credentials: 'include'
    });
    console.log(`📊 /me response status: ${meResponse.status}`);
    if (meResponse.status === 401) {
      console.log('✅ Correctly requires authentication');
    } else {
      console.log('❌ Should require authentication');
    }
  } catch (error) {
    console.log('❌ Error accessing /me:', error.message);
  }
  
  // Test 3: Test login
  try {
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    console.log(`📊 Login response status: ${loginResponse.status}`);
    const loginData = await loginResponse.json();
    console.log('📊 Login response:', loginData);
    
    if (loginResponse.status === 200) {
      console.log('✅ Login successful');
      
      // Test 4: Check if we can access /me after login
      const meResponse2 = await fetch(`${baseUrl}/api/auth/me`, {
        credentials: 'include'
      });
      console.log(`📊 /me after login status: ${meResponse2.status}`);
      
      if (meResponse2.status === 200) {
        const meData = await meResponse2.json();
        console.log('✅ Authentication working correctly');
        console.log('📊 User data:', meData.user);
      } else {
        console.log('❌ Cannot access /me after login');
      }
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.log('❌ Error during login test:', error.message);
  }
}

testAuth(); 