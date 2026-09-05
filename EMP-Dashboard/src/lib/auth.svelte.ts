import { api, setToken, getToken } from './api';

export type DashUser = { id: string; email: string; displayName: string; role: string };

class Auth {
	user = $state<DashUser | null>(null);
	ready = $state(false);

	async init() {
		if (!getToken()) {
			this.ready = true;
			return;
		}
		try {
			const r = await api.me();
			this.user = r.user;
		} catch {
			setToken(null);
		}
		this.ready = true;
	}

	async login(email: string, password: string) {
		const r = await api.login(email, password);
		setToken(r.token);
		this.user = r.user;
		return r.user as DashUser;
	}

	logout() {
		setToken(null);
		this.user = null;
	}

	get isStaff() {
		return !!this.user && this.user.role !== 'user';
	}
	get isSuper() {
		return this.user?.role === 'super_admin';
	}
}

export const auth = new Auth();
