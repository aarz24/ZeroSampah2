#!/usr/bin/env node

/**
 * Comprehensive API Testing Script for ZeroSampah
 * Tests all major API endpoints
 * 
 * Usage: node scripts/test-api-comprehensive.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Test utilities
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
  };
  const reset = '\x1b[0m';
  console.log(`${colors[type]}${message}${reset}`);
}

async function testEndpoint(name, method, path, body = null, expectedStatus = 200) {
  try {
    log(`\nTesting: ${name}`, 'info');
    log(`  ${method} ${path}`, 'info');
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
      log(`  Body: ${JSON.stringify(body, null, 2)}`, 'info');
    }
    
    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await response.json();
    
    if (response.status === expectedStatus) {
      log(`  ✓ Status: ${response.status} (expected ${expectedStatus})`, 'success');
      log(`  ✓ Response: ${JSON.stringify(data).substring(0, 100)}...`, 'success');
      return { success: true, data };
    } else {
      log(`  ✗ Status: ${response.status} (expected ${expectedStatus})`, 'error');
      log(`  ✗ Response: ${JSON.stringify(data, null, 2)}`, 'error');
      return { success: false, data };
    }
  } catch (error) {
    log(`  ✗ Error: ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('\n═══════════════════════════════════════════════', 'info');
  log('  ZeroSampah API Comprehensive Test Suite', 'info');
  log('═══════════════════════════════════════════════\n', 'info');
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  };
  
  // Test 1: Get Leaderboard
  const test1 = await testEndpoint(
    'Get Leaderboard',
    'GET',
    '/api/leaderboard'
  );
  results.total++;
  test1.success ? results.passed++ : results.failed++;
  
  // Test 2: Get Recent Reports
  const test2 = await testEndpoint(
    'Get Recent Reports',
    'GET',
    '/api/reports?limit=5'
  );
  results.total++;
  test2.success ? results.passed++ : results.failed++;
  
  // Test 3: Get Rewards Catalog
  const test3 = await testEndpoint(
    'Get Rewards Catalog',
    'GET',
    '/api/rewards'
  );
  results.total++;
  test3.success ? results.passed++ : results.failed++;
  
  // Test 4: Get Published Events
  const test4 = await testEndpoint(
    'Get Published Events',
    'GET',
    '/api/events'
  );
  results.total++;
  test4.success ? results.passed++ : results.failed++;
  
  // Test 5: Get Collection Tasks
  const test5 = await testEndpoint(
    'Get Collection Tasks',
    'GET',
    '/api/tasks'
  );
  results.total++;
  test5.success ? results.passed++ : results.failed++;
  
  // Test 6: Unauthorized Access (should fail with 401)
  const test6 = await testEndpoint(
    'Get User Stats (Unauthorized)',
    'GET',
    '/api/users/stats',
    null,
    401
  );
  results.total++;
  test6.success ? results.passed++ : results.failed++;
  
  // Test 7: Invalid Event Creation (should fail with 401)
  const test7 = await testEndpoint(
    'Create Event (Unauthorized)',
    'POST',
    '/api/events',
    {
      title: 'Test Event',
      location: 'Test Location',
      eventDate: '2025-12-31',
      eventTime: '10:00'
    },
    401
  );
  results.total++;
  test7.success ? results.passed++ : results.failed++;
  
  // Test 8: Invalid Reward Creation (missing fields)
  const test8 = await testEndpoint(
    'Create Reward (Invalid Input)',
    'POST',
    '/api/rewards',
    {
      name: '',  // Empty name
      pointsRequired: -10,  // Negative points
    },
    401  // Will fail on auth first
  );
  results.total++;
  test8.success ? results.passed++ : results.failed++;
  
  // Summary
  log('\n═══════════════════════════════════════════════', 'info');
  log('  Test Summary', 'info');
  log('═══════════════════════════════════════════════\n', 'info');
  log(`Total Tests: ${results.total}`, 'info');
  log(`Passed: ${results.passed}`, 'success');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'error' : 'success');
  log(`\nSuccess Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`, 
    results.failed > 0 ? 'warning' : 'success');
  
  if (results.failed === 0) {
    log('✨ All tests passed! ✨\n', 'success');
    process.exit(0);
  } else {
    log('⚠️  Some tests failed. Please review the errors above.\n', 'warning');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log(`\nFatal error: ${error.message}`, 'error');
  process.exit(1);
});
