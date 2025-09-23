import { SidebarTrigger } from '@/components/ui/sidebar';
import { NavItem, type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BellIcon,
    GlobeIcon,
    SearchIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    UserCircleIcon,
} from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from './ui/navigation-menu';

const headerNavItems: NavItem[] = [
    {
        title: 'My Domains',
        href: '/my-domains',
        icon: GlobeIcon,
    },
    {
        title: 'My Products',
        href: '/my-products',
        icon: ShoppingBagIcon,
    },
    {
        title: 'Get Domain',
        href: '/get-domain',
        icon: SearchIcon,
    },
];

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const page = usePage();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <h1>StrangeDomains</h1>

                {/* <Breadcrumbs breadcrumbs={breadcrumbs} /> */}
            </div>

            <NavigationMenu>
                <NavigationMenuList>
                    {headerNavItems.map((item) => (
                        <NavigationMenuItem key={item.title}>
                            <NavigationMenuIndicator />

                            <NavigationMenuLink
                                asChild
                                active={page.url.startsWith(
                                    typeof item.href === 'string'
                                        ? item.href
                                        : item.href.url,
                                )}
                            >
                                <Link
                                    href={item.href}
                                    className="flex-row items-center"
                                    data-active={
                                        page.url.startsWith(
                                            typeof item.href === 'string'
                                                ? item.href
                                                : item.href.url,
                                        )
                                    }
                                >
                                    {item.icon && (
                                        <item.icon className="inline size-3.5" />
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-4">
                <Link href="#">
                    <ShoppingCartIcon className="size-5" />
                </Link>

                <Link href="#">
                    <BellIcon className="size-5" />
                </Link>

                <Link href="#">
                    <UserCircleIcon className="size-5" />
                </Link>
            </div>
        </header>
    );
}
