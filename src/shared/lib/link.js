import { eventBus } from './eventbus.js';

export const handleLink = (event) => {
	event.preventDefault();
	const href = event.target.getAttribute('href');
	eventBus.emit('navigate', href);
};
