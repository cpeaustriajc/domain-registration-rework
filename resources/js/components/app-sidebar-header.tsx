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
import AppLogo from './app-logo';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
    NavigationMenu,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from './ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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

const domainsNotifications = [
    { id: 1, message: 'Domain example.com is expiring soon.' },
    { id: 2, message: 'New domain example.net has been registered.' },
];

const announcementsNotifications = [
    { id: 1, message: 'Welcome to our new platform!' },
    { id: 2, message: 'Scheduled maintenance on Saturday.' },
];

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const page = usePage();

    return (
        <header className="sticky top-0 z-20 flex w-full shrink-0 items-center justify-between gap-2 bg-sidebar/95 px-6 backdrop-blur-md transition-[width,height] ease-linear supports-[backdrop-filter]:bg-sidebar/60 md:px-4">
            <div className="flex h-(--header-height) flex-1 items-center">
                <SidebarTrigger className="mr-8" />
                <Link href="/my-domains">
                    <AppLogo />
                </Link>
                {/* <Breadcrumbs breadcrumbs={breadcrumbs} /> */}

                <NavigationMenu className="px-8">
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
                                        data-active={page.url.startsWith(
                                            typeof item.href === 'string'
                                                ? item.href
                                                : item.href.url,
                                        )}
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
            </div>

            <div className="flex items-center gap-4">
                <Link href="#">
                    <ShoppingCartIcon className="size-5" />
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="relative"
                        >
                            <Badge className="absolute -top-2 left-full z-20 min-w-5 -translate-x-1/2 px-1">
                                {domainsNotifications.length +
                                    announcementsNotifications.length}
                            </Badge>

                            <BellIcon className="size-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Notifications</SheetTitle>
                            <SheetDescription>
                                You have no new notifications.
                            </SheetDescription>
                        </SheetHeader>
                        <Tabs defaultValue="tab-1">
                            <TabsList className="relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
                                <TabsTrigger
                                    value="tab-1"
                                    className="relative rounded-b-none border-x border-t bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                >
                                    <Badge className="absolute -top-2 -right-2 z-20 min-w-5 -translate-x-1/2 px-1">
                                        {domainsNotifications.length}
                                    </Badge>
                                    Domains
                                </TabsTrigger>
                                <TabsTrigger
                                    value="tab-2"
                                    className="relative rounded-b-none border-x border-t bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                >
                                    <Badge className="absolute -top-2 -right-2 z-20 min-w-5 -translate-x-1/2 px-1">
                                        {announcementsNotifications.length}
                                    </Badge>
                                    Announcements
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="tab-1">
                                {domainsNotifications.length === 0 ? (
                                    <p className="p-4 text-center text-xs text-muted-foreground">
                                        You have no new notifications.
                                    </p>
                                ) : (
                                    <ul>
                                        {domainsNotifications.map(
                                            (notification) => (
                                                <li
                                                    key={notification.id}
                                                    className="border-b p-4 last:border-0"
                                                >
                                                    <p className="text-sm">
                                                        {notification.message}
                                                    </p>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                )}
                            </TabsContent>
                            <TabsContent value="tab-2">
                                {announcementsNotifications.length === 0 ? (
                                    <p className="p-4 text-center text-xs text-muted-foreground">
                                        You have no new notifications.
                                    </p>
                                ) : (
                                    <ul>
                                        {announcementsNotifications.map(
                                            (notification) => (
                                                <li
                                                    key={notification.id}
                                                    className="border-b p-4 last:border-0"
                                                >
                                                    <p className="text-sm">
                                                        {notification.message}
                                                    </p>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                )}
                            </TabsContent>
                        </Tabs>
                    </SheetContent>
                </Sheet>

                <Link href="#">
                    <UserCircleIcon className="size-5" />
                </Link>
            </div>
        </header>
    );
}
