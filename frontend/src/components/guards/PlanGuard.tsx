import React from "react";
import { Page, Layout, Card, EmptyState, Box, Text } from "@shopify/polaris";
import { usePlanUsage } from "../../hooks/usePlanUsage";
import { PlanAction } from "../../constants/plan.constants";
import { useNavigate } from "react-router-dom";

interface PlanGuardProps {
    children: React.ReactNode;
    action?: PlanAction;
}

export const PlanGuard: React.FC<PlanGuardProps> = ({ children, action }) => {
    const { hasPermission, isLoading } = usePlanUsage();
    const navigate = useNavigate();

    console.log("running guard section")

    if (isLoading) {
        return (
            <Page>
                <Layout>
                    <Layout.Section>
                        <Card>
                            <Box padding="400">
                                <Text variant="bodyMd" as="p">Loading plan information...</Text>
                            </Box>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    if (action && !hasPermission(action)) {
        return (
            <Page title="Feature Restricted">
                <Layout>
                    <Layout.Section>
                        <EmptyState
                            heading="Upgrade your plan to use this feature"
                            action={{
                                content: "See Plans",
                                onAction: () => navigate("/plans"),
                            }}
                            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                        >
                            <p>
                                This feature is available only on our Pro and Ultimate plans.
                                Upgrade today to unlock full access to the Form Builder and other advanced features.
                            </p>
                        </EmptyState>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    return <>{children}</>;
};
