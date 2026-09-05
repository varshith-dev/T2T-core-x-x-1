// Talks to the live T2T backend (same-origin /api in prod; vite proxies in dev).
const BASE = '/api';
const KEY = 't2t_dash_token';

export const getToken = () =>
	typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null;
export const setToken = (t: string | null) => {
	if (typeof localStorage === 'undefined') return;
	if (t) localStorage.setItem(KEY, t);
	else localStorage.removeItem(KEY);
};

async function req<T = any>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
	const headers: Record<string, string> = {};
	const token = getToken();
	if (token) headers.authorization = 'Bearer ' + token;
	let body: string | undefined;
	if (opts.body !== undefined) {
		headers['content-type'] = 'application/json';
		body = JSON.stringify(opts.body);
	}
	const res = await fetch(BASE + path, { method: opts.method ?? (body ? 'POST' : 'GET'), headers, body });
	const text = await res.text();
	const data = text ? JSON.parse(text) : null;
	if (!res.ok) throw Object.assign(new Error(data?.error ?? 'request failed'), { status: res.status, data });
	return data as T;
}

export const api = {
	login: (email: string, password: string) => req('/auth/login', { body: { email, password } }),
	me: () => req('/auth/me'),
	// dashboards
	analytics: () => req('/admin/analytics'),
	ml: () => req('/admin/ml'),
	fraud: () => req('/admin/fraud'),
	couponStats: () => req('/admin/coupon-stats'),
	audit: () => req('/admin/audit'),
	usersDetail: () => req('/admin/users-detail'),
	dbTables: () => req('/admin/db/tables'),
	dbTable: (t: string) => req('/admin/db/' + t),
	leaderboard: () => req('/leaderboard'),
	// governance
	pointRules: () => req('/admin/point-rules'),
	setPointRule: (cat: string, b: { points: number; dailyCap: number; active: boolean }) =>
		req('/admin/point-rules/' + cat, { method: 'PUT', body: b }),
	setRole: (id: string, role: string) => req(`/admin/users/${id}/role`, { method: 'PATCH', body: { role } }),
	reprocess: () => req('/admin/reprocess', { method: 'POST', body: {} }),
	// review
	reviewQueue: () => req('/review/queue'),
	approve: (id: string, category: string) => req(`/review/${id}/approve`, { body: { category } }),
	reject: (id: string) => req(`/review/${id}/reject`, { method: 'POST', body: {} }),
	// coupons
	coupons: () => req('/coupons'),
	createCoupon: (b: unknown) => req('/coupons', { body: b }),
	updateCoupon: (id: string, b: unknown) => req(`/coupons/${id}`, { method: 'PATCH', body: b }),
	redemptions: () => req('/redemptions'),
	fulfill: (id: string) => req(`/redemptions/${id}/fulfill`, { method: 'POST', body: {} }),
	rejectRedemption: (id: string) => req(`/redemptions/${id}/reject`, { method: 'POST', body: {} })
};
