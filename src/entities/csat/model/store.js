import { Storage } from '../../../shared/lib/storage.js';

class CSATStore {
	constructor() {
		this.storage = {
			csat: Storage.load('csat') || {},
		};
	}

    submitted = () => {
		return this.storage.csat?.submitted;
	};

    submit = () => {
        this.storage.csat = {
            submitted: true,
        };
        Storage.save('csat', this.storage.csat);
    };
}

export const csatStore = new CSATStore();
