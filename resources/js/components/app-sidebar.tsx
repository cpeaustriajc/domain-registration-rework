import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from '@/components/ui/sidebar';
import {
    domainTransfer,
    getDomain,
    myDomains,
    myProducts,
    preferences,
    pushDomain,
} from '@/routes';
import { type NavItem } from '@/types';
import {
    ArrowRightLeftIcon,
    GlobeIcon,
    MessageSquareWarningIcon,
    PieChartIcon,
    SearchIcon,
    Settings2Icon,
    ShoppingBagIcon,
} from 'lucide-react';
import { NavDomainManagement } from './nav-domain-management';

const mainNavItems: NavItem[] = [
    {
        title: 'Get Domain',
        href: getDomain().url,
        icon: SearchIcon,
    },
    {
        title: 'My Domains',
        href: myDomains().url,
        icon: GlobeIcon,
    },
    {
        title: 'My Products',
        href: myProducts().url,
        icon: ShoppingBagIcon,
    },
];

const domainManagementNavItems: NavItem[] = [
    {
        title: 'Push Domain',
        href: pushDomain().url,
        icon: PieChartIcon,
    },
    {
        title: 'Preferences',
        href: preferences().url, // Use the correct route helper for preferences
        icon: Settings2Icon,
    },
    {
        title: 'Domain Transfer',
        href: domainTransfer().url,
        icon: ArrowRightLeftIcon,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Report Abuse',
        href: '#',
        icon: MessageSquareWarningIcon,
    },
];

export function AppSidebar() {
    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            collapsible="icon"
            variant="inset"
        >
            <SidebarContent className="py-4">
                <NavMain items={mainNavItems} />
                <NavDomainManagement items={domainManagementNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {/* <NavUser /> */}
            </SidebarFooter>
        </Sidebar>
    );
}
