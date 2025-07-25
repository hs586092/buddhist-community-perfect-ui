// Service Worker for Buddhist Community
// 불교 커뮤니티를 위한 오프라인 지원

const CACHE_NAME = 'buddhist-community-v1';
const STATIC_CACHE = 'buddhist-static-v1';
const DYNAMIC_CACHE = 'buddhist-dynamic-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  // Add your built CSS and JS files here
  // These will be generated after build
];

// Resources to cache on first visit
const DYNAMIC_ASSETS = [
  '/review',
  '/community',
  '/about'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🪷 Service Worker 설치 중...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 정적 자원 캐싱 중...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker 설치 완료');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker 설치 실패:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker 활성화 중...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ 오래된 캐시 삭제:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker 활성화 완료');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
  } else if (isPageRequest(request)) {
    event.respondWith(networkFirst(request));
  } else if (isAPIRequest(request.url)) {
    event.respondWith(networkOnly(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache strategies

// Cache First - for static assets
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First 전략 실패:', error);
    return caches.match('/offline.html') || new Response('오프라인입니다');
  }
}

// Network First - for pages
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    console.log('네트워크 연결 실패, 캐시에서 제공:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/') || new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>오프라인 - 불교 커뮤니티</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh; 
              margin: 0;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              text-align: center;
              padding: 20px;
            }
            .container {
              max-width: 400px;
              background: white;
              padding: 2rem;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .lotus { font-size: 3rem; margin-bottom: 1rem; }
            h1 { color: #374151; margin-bottom: 1rem; }
            p { color: #6b7280; line-height: 1.6; }
            button {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              cursor: pointer;
              margin-top: 1rem;
            }
            button:hover { background: #2563eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="lotus">🪷</div>
            <h1>오프라인 상태</h1>
            <p>인터넷 연결을 확인해주세요.<br>연결이 복구되면 자동으로 동기화됩니다.</p>
            <button onclick="window.location.reload()">다시 시도</button>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    throw error;
  }
}

// Network Only - for API requests
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('API 요청 실패:', request.url, error);
    
    // Return meaningful error response for API calls
    return new Response(JSON.stringify({
      error: 'network_unavailable',
      message: '네트워크 연결을 확인해주세요',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Stale While Revalidate - for other resources
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    cache.put(request, networkResponse.clone());
    return networkResponse;
  }).catch((error) => {
    console.log('백그라운드 업데이트 실패:', request.url);
    return cachedResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return /\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/.test(url);
}

function isPageRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

function isAPIRequest(url) {
  return url.includes('/api/');
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('🔄 Service Worker 업데이트 적용 중...');
    self.skipWaiting();
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 백그라운드 동기화 시작');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Handle offline actions that were queued
    // For example: sync offline reviews, messages, etc.
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await syncAction(action);
        await removeOfflineAction(action.id);
      } catch (error) {
        console.error('동기화 실패:', action, error);
      }
    }
    
    console.log('✅ 백그라운드 동기화 완료');
  } catch (error) {
    console.error('❌ 백그라운드 동기화 실패:', error);
  }
}

async function getOfflineActions() {
  // This would retrieve actions stored in IndexedDB
  // For now, return empty array
  return [];
}

async function syncAction(action) {
  // Sync individual action with server
  const response = await fetch(action.url, {
    method: action.method,
    headers: action.headers,
    body: action.body
  });
  
  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`);
  }
  
  return response;
}

async function removeOfflineAction(actionId) {
  // Remove synced action from IndexedDB
  console.log('동기화된 액션 제거:', actionId);
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || '새로운 알림이 있습니다',
      icon: '/logo192.png',
      badge: '/favicon.ico',
      tag: data.tag || 'general',
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: '보기'
        },
        {
          action: 'close',
          title: '닫기'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || '불교 커뮤니티', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

console.log('🪷 불교 커뮤니티 Service Worker가 로드되었습니다');