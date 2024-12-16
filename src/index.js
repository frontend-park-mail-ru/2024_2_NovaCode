import './index.scss';
import { App } from './app/app.js';
import "../public/images/icons/logo.svg";

// if ('serviceWorker' in navigator) {
// 	navigator.serviceWorker
// 		.register('sw.js', { scope: '/' })
// 		.then(function (registration) {
// 			console.log('ServiceWorker registration');
// 		})
// 		.catch(function (err) {
// 			console.error(err);
// 		});
// }

const app = new App();
await app.run();
