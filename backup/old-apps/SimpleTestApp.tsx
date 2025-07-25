/**
 * Simple Test App - No external dependencies to isolate API issue
 */

import React, { useState } from 'react'

const SimpleTestApp: React.FC = () => {
  const [test, setTest] = useState('Hello World')

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea, #764ba2)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '40px',
        borderRadius: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#333', 
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          🏛️ 법회 리뷰 사이트 - 테스트
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#666',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          API 에러 해결을 위한 테스트 버전입니다
        </p>

        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          border: '2px solid #e9ecef'
        }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px', 
            fontWeight: 'bold',
            color: '#495057'
          }}>
            테스트 입력:
          </label>
          <input 
            type="text"
            value={test}
            onChange={(e) => setTest(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <p style={{ 
            marginTop: '15px', 
            color: '#6c757d',
            textAlign: 'center'
          }}>
            입력값: {test}
          </p>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'linear-gradient(135deg, #0070f3, #00d4ff)',
          color: 'white',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <strong>상태: API 서비스 없이 동작 중</strong>
        </div>
      </div>
    </div>
  )
}

export default SimpleTestApp