import { App } from './app/app.js';

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('sw.js', { scope: '/' })
		.then(function (registration) {
			console.log('ServiceWorker registration');
		})
		.catch(function (err) {
			console.error(err);
		});
}

const app = new App();
app.run();
