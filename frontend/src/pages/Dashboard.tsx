import React from 'react';
import {
    Page,
    Layout,
    Card,
    BlockStack,
    Text,
    SkeletonDisplayText,
    SkeletonBodyText,
    Grid,
    Badge,
    Icon,
    Box,
    InlineStack
} from '@shopify/polaris';
import {
    ProductIcon,
    OrderIcon,
    PlanIcon,
    CalendarIcon
} from '@shopify/polaris-icons';
import { useDashboardStats } from '../hooks/useDashboardStats';

export const Dashboard: React.FC = () => {
    const { data: stats, isLoading: loading, error } = useDashboardStats();

    if (error) {
        return (
            <Page title="Dashboard">
                <Layout>
                    <Layout.Section>
                        <Card>
                            <Text as="p" variant="bodyMd" tone="critical">
                                Failed to load dashboard statistics. Please try again later.
                            </Text>
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }

    const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: any; color?: any }) => (
        <Card>
            <BlockStack gap="200">
                <InlineStack align="space-between">
                    <Text as="h2" variant="headingSm" tone="subdued">
                        {title}
                    </Text>
                    <Box padding="100" borderRadius="200">
                        <Icon source={icon} tone={color || "base"} />
                    </Box>
                </InlineStack>
                <Text as="p" variant="headingLg">
                    {loading ? <SkeletonDisplayText size="small" /> : value}
                </Text>
            </BlockStack>
        </Card>
    );

    return (
        <Page title="Dashboard">
            <Layout>
                <Layout.Section>
                    <Grid>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
                            <StatCard
                                title="Total Quotes"
                                value={stats?.totalQuotes ?? 0}
                                icon={ProductIcon}
                                color="info"
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
                            <StatCard
                                title="Converted Quotes"
                                value={stats?.convertedQuotes ?? 0}
                                icon={OrderIcon}
                                color="success"
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
                            <StatCard
                                title="Current Plan"
                                value={stats?.currentPlan ?? "Free"}
                                icon={PlanIcon}
                                color="warning"
                            />
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
                            <StatCard
                                title="Days Remaining"
                                value={stats?.daysRemaining ?? 0}
                                icon={CalendarIcon}
                                color="critical"
                            />
                        </Grid.Cell>
                    </Grid>
                </Layout.Section>

                <Layout.Section>
                    <Card>
                        <BlockStack gap="400">
                            <Text as="h2" variant="headingMd">
                                Account Overview
                            </Text>
                            {loading ? (
                                <SkeletonBodyText lines={2} />
                            ) : (
                                <Text as="p" variant="bodyMd">
                                    You have converted <Text as="span" fontWeight="bold">{((stats?.convertedQuotes ?? 0) / (stats?.totalQuotes || 1) * 100).toFixed(1)}%</Text> of your quotes into draft orders.
                                    Your current plan is <Badge tone={stats?.currentPlan === 'PRO' ? 'success' : 'info'}>{stats?.currentPlan}</Badge>.
                                </Text>
                            )}
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};
