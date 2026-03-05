export interface IDashboardStats {
    totalQuotes: number;
    convertedQuotes: number;
    currentPlan: string;
    daysRemaining: number;
}

export interface IDashboardService {
    getStats(shop: string): Promise<IDashboardStats>;
}
