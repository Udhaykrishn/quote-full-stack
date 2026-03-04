import { Router } from "express";
import { container } from "@/inversify.config";
import { TYPES } from "@/types";
import { DashboardController } from "@/controllers/dashboard.controller";
import { shopify } from "@/config/shopify.config";

const dashboardRouter = Router();
const dashboardController = container.get<DashboardController>(TYPES.DashboardController);

// All dashboard routes should be protected by Shopify session validation
dashboardRouter.get("/stats", shopify.validateAuthenticatedSession(), dashboardController.getStats);

export default dashboardRouter;
