import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { AppSidebarLeft } from '@/components/app-sidebar-left';
import { AppSidebarRight } from '@/components/app-sidebar-right';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebarHeader breadcrumbs={breadcrumbs} />
            <div className="flex flex-1">
                <AppSidebarLeft />
                <AppContent variant="sidebar">{children}</AppContent>
            </div>
            <AppSidebarRight />
        </AppShell>
    );
}
