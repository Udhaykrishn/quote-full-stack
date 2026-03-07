import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Settings } from '../pages/Settings';
import { Quotes } from '../pages/Quotes';
import { DraftOrders } from '../pages/DraftOrders';
import { Plans } from '../pages/Plans';
import { FormBuilder } from '../pages/FormBuilder';
import { Legal } from '../pages/Legal';
import { PlanGuard } from '../components/guards/PlanGuard';
import { PlanAction } from '../constants/plan.constants';

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/form-builder" element={<FormBuilder />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/draft-orders" element={
                <PlanGuard action={PlanAction.DRAFT_ORDER_CREATE}>
                    <DraftOrders />
                </PlanGuard>
            } />
            <Route path="/plans" element={<Plans />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
