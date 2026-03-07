import React from 'react';
import { useLocation } from 'react-router-dom';
import { TitleBar, NavMenu } from '@shopify/app-bridge-react';
import { Frame, Loading } from '@shopify/polaris';
import { useIsFetching } from '@tanstack/react-query';
import { usePlanUsage } from '../hooks/usePlanUsage';
import { PlanAction } from '../constants/plan.constants';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isFetching = useIsFetching();
    const { hasPermission } = usePlanUsage();

    const getTitle = (path: string) => {
        switch (path) {
            case '/': return 'Dashboard';
            case '/settings': return 'Settings';
            case '/form-builder': return 'Form Builder';
            case '/quotes': return 'Quotes';
            case '/draft-orders': return 'Draft Orders';
            case '/plans': return 'Plans & Billing';
            default: return 'My B2B App';
        }
    };

    return (
        <Frame>
            {isFetching > 0 && <Loading />}
            <NavMenu>
                <a href="/" rel="home">Dashboard</a>
                <a href="/settings">Settings</a>
                <a href='/form-builder'>Form Builder</a>
                <a href='/quotes'>Quotes</a>
                {hasPermission(PlanAction.DRAFT_ORDER_CREATE) && <a href='/draft-orders'>Draft Orders</a>}
                <a href='/plans'>Plans & Billing</a>
            </NavMenu>

            <TitleBar title={getTitle(location.pathname)} />

            {children}
        </Frame>
    );
};
