import { injectable, inject } from "inversify";
import { TYPES } from "@/types";
import type {
    IDashboardService,
    IMerchantService,
    IQuoteRepository,
    IPlanService,
    IDashboardStats
} from "@/interfaces";
import { PlanType } from "@/constants";

@injectable()
export class DashboardService implements IDashboardService {
    constructor(
        @inject(TYPES.IMerchantService) private merchantService: IMerchantService,
        @inject(TYPES.IQuoteRepository) private quoteRepository: IQuoteRepository,
        @inject(TYPES.IPlanService) private planService: IPlanService
    ) { }

    async getStats(shop: string): Promise<IDashboardStats> {
        const merchant = await this.merchantService.getMerchantByShop(shop);
        if (!merchant) {
            throw new Error("Merchant not found");
        }

        const [totalQuotes, convertedQuotes, plan] = await Promise.all([
            this.quoteRepository.countByMerchant(shop),
            this.quoteRepository.countConvertedByMerchant(shop),
            this.planService.getMerchantPlan(shop)
        ]);

        const currentPlan = plan?.name || PlanType.FREE;

        // Calculate days remaining (current month cycle) - matching UsageService logic
        let daysRemaining = 0;
        const quotaStart = merchant.usage?.quotaPeriodStart || merchant.createdAt;
        if (quotaStart) {
            const nextBillingDate = new Date(quotaStart);
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

            const now = new Date();
            const diffMs = nextBillingDate.getTime() - now.getTime();
            daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        }

        return {
            totalQuotes,
            convertedQuotes,
            currentPlan,
            daysRemaining
        };
    }
}
