// const CACHE_NAME = 'cache-v1';

// this.addEventListener('install', (event) => {
// 	event.waitUntil(
// 		caches.open(CACHE_NAME).then((cache) => {
// 			return cache.addAll(['/']);
// 		}),
// 	);
// });

// this.addEventListener('activate', (event) => {
// 	const expectedCaches = [CACHE_NAME];
// 	event.waitUntil(
// 		caches.keys().then((cacheNames) => {
// 			return Promise.all(
// 				cacheNames.map((cacheName) => {
// 					if (!expectedCaches.includes(cacheName)) {
// 						return caches.delete(cacheName);
// 					}
// 				}),
// 			);
// 		}),
// 	);
// });

// this.addEventListener('fetch', (event) => {
// 	const url = new URL(event.request.url);

// 	if (
// 		url.pathname === '/' ||
// 		url.pathname.match(/.*\.(css)|(js)|(svg)|(png)|(jpg)|(jpeg)$/) ||
// 		url.pathname.match(/\/api\/v1\/(tracks)|(artists)|(albums)$/)
// 	) {
// 		event.respondWith(
// 			caches.match(event.request).then((cached) => {
// 				if (cached) {
// 					return cached;
// 				}

// 				return fetch(event.request).then((response) => {
// 					return caches.open(CACHE_NAME).then((cache) => {
// 						cache.put(event.request, response.clone());
// 						return response;
// 					});
// 				});
// 			}),
// 		);
// 	}
// });
