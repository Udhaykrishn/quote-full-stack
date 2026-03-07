import { useQuery } from "@tanstack/react-query";
import { getCurrentPlan } from "../api/plans";
import { PlanAction } from "../constants/plan.constants";

export interface PlanUsage {
    merchant: {
        _id: string;
        shop: string;
        usage: {
            quotesUsed: number;
            quotaPeriodStart: string;
        };
    };
    plan: {
        id: string;
        name: string;
        quoteLimit: number;
        permissions: string[];
        price: number;
    };
}

export const usePlanUsage = () => {
    const { data: usage, isLoading, error, refetch } = useQuery<PlanUsage>({
        queryKey: ["planUsage"],
        queryFn: getCurrentPlan,
        staleTime: 5 * 60 * 1000,
    });

    const hasPermission = (action: PlanAction | string) => {
        if (!usage?.plan?.permissions) return false;
        return usage.plan.permissions.includes(action as string);
    };

    const isUsageExceeded = () => {
        if (!usage?.plan || !usage?.merchant) return false;
        return usage.merchant.usage.quotesUsed >= usage.plan.quoteLimit;
    };

    const getRemainingQuotes = () => {
        if (!usage?.plan || !usage?.merchant) return 0;
        return Math.max(0, usage.plan.quoteLimit - usage.merchant.usage.quotesUsed);
    };

    return {
        usage,
        isLoading,
        error,
        hasPermission,
        isUsageExceeded,
        getRemainingQuotes,
        refetch,
    };
};
