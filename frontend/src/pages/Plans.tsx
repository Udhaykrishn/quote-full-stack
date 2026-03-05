import React, { useState } from 'react';
import { Page, Layout, Card, BlockStack, Text, Button, InlineStack, Badge, Banner, Box, Icon, Divider, Link } from '@shopify/polaris';
import { CheckIcon, XIcon } from "@shopify/polaris-icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCurrentPlan, upgradePlan } from "../api/plans";
import { useAppBridge } from '@shopify/app-bridge-react';
import planData from '../data/plans.json';

interface Feature {
    text: string;
    included: boolean;
    bold?: boolean;
    highlighted?: boolean;
}

interface Plan {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    isPopular?: boolean;
    trialDays?: number;
    features: Feature[];
}



export const Plans: React.FC = () => {
    const shopify = useAppBridge();
    const [upgradeError, setUpgradeError] = useState<string | null>(null);

    const { data: currentPlanData, isLoading } = useQuery({
        queryKey: ["currentPlan"],
        queryFn: getCurrentPlan
    });

    const upgradeMutation = useMutation({
        mutationFn: (planName: string) => upgradePlan(planName),
        onSuccess: (data: any) => {
            const url = data.data?.confirmationUrl || data.confirmationUrl;
            if (url) {
                window.open(url, "_top");
            }
        },
        onError: (error: any) => {
            setUpgradeError(error.message);
            shopify.toast.show("Upgrade failed", { isError: true });
        }
    });

    const handleUpgrade = (planName: string) => {
        setUpgradeError(null);
        upgradeMutation.mutate(planName);
    };

    if (isLoading) {
        return (
            <Page>
                <Box paddingBlockStart="800">
                    <InlineStack align="center">
                        <Text as="p" variant="bodyMd">Loading plans...</Text>
                    </InlineStack>
                </Box>
            </Page>
        );
    }

    return (
        <Page>
            <Box paddingBlockEnd="800">
                <Layout>
                    {upgradeError && (
                        <Layout.Section>
                            <Banner tone="critical" onDismiss={() => setUpgradeError(null)}>
                                <p>{upgradeError}</p>
                            </Banner>
                        </Layout.Section>
                    )}

                    <Layout.Section>
                        <Box paddingBlockEnd="400" paddingBlockStart="400">
                            <BlockStack gap="200" align="center">
                                <Text as="h1" variant="heading2xl" alignment="center">Choose the right plan for your business</Text>
                                <Text as="p" variant="bodyLg" tone="subdued" alignment="center">
                                    Scale your quoting process with advanced automation and professional branding.
                                </Text>
                            </BlockStack>
                        </Box>
                    </Layout.Section>

                    <Layout.Section>
                        <div className="max-w-[1100px] mx-auto w-full px-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                                {(planData as Plan[]).map((plan) => (
                                    <div key={plan.id} className="flex flex-col">
                                        <div className={`h-full ${plan.isPopular ? 'border-2 border-[var(--p-color-border-brand)] rounded-[var(--p-border-radius-300)] overflow-hidden' : ''}`}>
                                            <Card padding="400">
                                                <div className="flex flex-col h-[300px]">
                                                    <BlockStack gap="200">
                                                        <div className="min-h-[40px]">
                                                            <div className="flex justify-between items-start">
                                                                <BlockStack gap="200">
                                                                    <Text as="h2" variant="headingLg" fontWeight={plan.isPopular ? "bold" : undefined}>{plan.name}</Text>
                                                                    <Text as="p" variant="bodyMd" tone="subdued">{plan.description}</Text>
                                                                </BlockStack>
                                                                {plan.isPopular && <Badge tone="info">Popular</Badge>}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-1 min-h-[40px] justify-center">
                                                            <div className="flex items-baseline gap-1">
                                                                <Text as="span" variant="heading3xl" fontWeight={plan.price !== 'Free' ? 'bold' : undefined}>{plan.price}</Text>
                                                                <Text as="span" variant="bodyMd" tone="subdued">{plan.period}</Text>
                                                            </div>
                                                            {plan.trialDays && (
                                                                <Text as="p" variant="bodySm" tone="success" fontWeight="bold">{plan.trialDays} DAY FREE TRIAL</Text>
                                                            )}
                                                        </div>

                                                        <Button
                                                            variant={currentPlanData?.name === plan.id ? "secondary" : (plan.id === 'PRO' ? 'primary' : 'secondary')}
                                                            fullWidth
                                                            size="large"
                                                            loading={upgradeMutation.isPending && upgradeMutation.variables === plan.id}
                                                            disabled={currentPlanData?.name === plan.id}
                                                            onClick={() => handleUpgrade(plan.id)}
                                                        >
                                                            {currentPlanData?.name === plan.id ? "Current plan" : (plan.id === 'FREE' ? "Switch to Free" : `Upgrade to ${plan.name}`)}
                                                        </Button>

                                                        <Divider />

                                                        <BlockStack gap="200">
                                                            {plan.features.map((feature, idx) => (
                                                                <div key={idx} className={`flex items-start gap-3 ${!feature.included ? 'opacity-30' : ''}`}>
                                                                    <div className="min-w-[20px]">
                                                                        <Icon source={feature.included ? CheckIcon : XIcon} tone={feature.included ? "success" : "critical"} />
                                                                    </div>
                                                                    <Text as="span" variant="bodyMd" fontWeight={feature.bold ? 'bold' : (feature.highlighted ? 'semibold' : undefined)} tone={feature.highlighted ? 'success' : undefined}>
                                                                        {feature.text}
                                                                    </Text>
                                                                </div>
                                                            ))}
                                                        </BlockStack>
                                                    </BlockStack>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Layout.Section>

                    <Layout.Section>
                        <Box paddingBlockStart="400" paddingBlockEnd="400">
                            <BlockStack gap="200" align="center">
                                <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                                    All recurring charges occur every 30 days in USD. Trial period is completely free.
                                </Text>
                                <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                                    Have questions? <Link url="mailto:krishnauday320@gmail.com" monochrome>Contact our support team</Link>
                                </Text>
                            </BlockStack>
                        </Box>
                    </Layout.Section>
                </Layout>
            </Box>
        </Page>
    );
};
