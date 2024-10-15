import trackTemplate from './.hbs';

export class TrackView {
	/**
	 * Initializes the TrackView.
	 *
	 */
	constructor() {
		this.root = document.querySelector('#root');
	}

	/**
	 * Renders the playlist view.
	 */
	render(track) {
		const items = track.map(({ name, artist, image, duration }) => {
			const minutes = Math.floor(duration / 60);
			const seconds = duration % 60;
			const duration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
			return { name, artist, image, duration };
		});

		this.root.innerHTML = trackTemplate({ items });
	}
}
