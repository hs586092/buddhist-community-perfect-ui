/**
 * Minimal Test App - No dependencies
 */

import React from 'react'

const TestApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#333' }}>🏛️ Test App</h1>
      <p>Simple test to isolate the issue</p>
      <div style={{ 
        background: 'linear-gradient(135deg, #0070f3, #00d4ff)', 
        color: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        Modern design test
      </div>
    </div>
  )
}

export default TestApp