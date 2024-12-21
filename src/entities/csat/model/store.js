import { Storage } from '../../../shared/lib/storage.js';

class CSATStore {
	constructor(firstShow = 5, showInterval = 30) {
		this.storage = {
			csat: Storage.load('csat') || {},
		};
        this.callCount = this.storage.csat?.callCount || 0;

        this.firstShow = firstShow;
        this.showInterval = showInterval;
	}

	submitted = () => {
		return this.storage.csat?.submitted;
	};

	submit = () => {
		this.storage.csat = {
			submitted: true,
			callCount: this.callCount,
		};
		Storage.save('csat', this.storage.csat);
	};

	shouldShow = () => {
		this.callCount += 1;

		this.storage.csat.callCount = this.callCount;
		Storage.save('csat', this.storage.csat);

		if (this.callCount === this.firstShow || (this.callCount - this.firstShow) % this.showInterval === 0) {
			return true;
		}
		return false;
	};
}

export const csatStore = new CSATStore();
