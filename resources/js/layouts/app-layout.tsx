import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { NuqsAdapter } from '@/lib/nuqs-adapter-inertia';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <NuqsAdapter>
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    </NuqsAdapter>
);
