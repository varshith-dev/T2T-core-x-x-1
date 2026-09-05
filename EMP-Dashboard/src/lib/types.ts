export interface DashboardRole {
	id: string;
	name: string;
	badge: string;
	badgeColor: 'emerald' | 'purple' | 'amber' | 'cyan' | 'destructive' | 'success' | 'warning';
	path: string;
	icon: string;
	description: string;
	roles: string[]; // roles allowed here (super_admin can always access)
}

export const DASHBOARD_ROLES: DashboardRole[] = [
	{
		id: 'super-admin',
		name: 'Super Admin',
		badge: 'SUPER ADMIN',
		badgeColor: 'destructive',
		path: '/super-admin',
		icon: 'Shield',
		description: 'Governance: users & roles, point rules, categories, audit log, reprocess & database.',
		roles: ['super_admin']
	},
	{
		id: 'admin-analytics',
		name: 'Admin & Analytics',
		badge: 'ANALYTICS',
		badgeColor: 'purple',
		path: '/admin-analytics',
		icon: 'BarChart3',
		description: 'Platform KPIs, submission trends, category breakdown, coupons & leaderboard.',
		roles: ['admin', 'super_admin']
	},
	{
		id: 'reviewer',
		name: 'Reviewer',
		badge: 'CONTENT QA',
		badgeColor: 'amber',
		path: '/reviewer',
		icon: 'CheckSquare',
		description: 'Human review of flagged waste photos — approve or reject.',
		roles: ['reviewer', 'admin', 'super_admin']
	},
	{
		id: 'ml-analyst',
		name: 'ML Ops',
		badge: 'ML',
		badgeColor: 'cyan',
		path: '/ml-analyst',
		icon: 'Cpu',
		description: 'Model accuracy, confidence distribution, ML-vs-reviewer agreement & versions.',
		roles: ['admin', 'super_admin']
	},
	{
		id: 'fraud-compliance',
		name: 'Fraud & Trust',
		badge: 'FRAUD',
		badgeColor: 'destructive',
		path: '/fraud-compliance',
		icon: 'ShieldAlert',
		description: 'Duplicate images, non-waste exploitation, GPS anomalies & high-risk users.',
		roles: ['admin', 'super_admin']
	},
	{
		id: 'coupon-manager',
		name: 'Coupons',
		badge: 'REWARDS',
		badgeColor: 'success',
		path: '/coupon-manager',
		icon: 'TicketPercent',
		description: 'Coupons, redemptions & fulfillment, points liability.',
		roles: ['catalog_manager', 'admin', 'super_admin']
	}
];

export function dashboardsFor(role?: string): DashboardRole[] {
	if (!role) return [];
	if (role === 'super_admin') return DASHBOARD_ROLES;
	return DASHBOARD_ROLES.filter((d) => d.roles.includes(role));
}

export function canAccess(role: string | undefined, path: string): boolean {
	if (role === 'super_admin') return true;
	const d = DASHBOARD_ROLES.find((x) => path.startsWith(x.path));
	return !!d && !!role && d.roles.includes(role);
}
