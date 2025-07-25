const fs = require('fs');
const path = require('path');
const http = require('http');

const server = http.createServer((req, res) => {
  // CORS 헤더 추가
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
  
  // 파일 확장자에 따른 Content-Type 설정
  const ext = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.json': 'application/json'
  }[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = 9000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`🪷 영성 커뮤니티 서버가 http://127.0.0.1:${PORT}에서 실행 중입니다`);
  console.log(`브라우저에서 http://localhost:${PORT} 또는 http://127.0.0.1:${PORT}로 접속해보세요!`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`포트 ${PORT}이 사용 중입니다. 다른 포트를 시도합니다.`);
    server.listen(0, '127.0.0.1', () => {
      const actualPort = server.address().port;
      console.log(`🪷 영성 커뮤니티 서버가 http://127.0.0.1:${actualPort}에서 실행 중입니다`);
      console.log(`브라우저에서 http://localhost:${actualPort} 또는 http://127.0.0.1:${actualPort}로 접속해보세요!`);
    });
  } else {
    console.error('서버 시작 오류:', err);
  }
});