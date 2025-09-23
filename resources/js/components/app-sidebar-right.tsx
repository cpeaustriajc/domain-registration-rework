import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { PackageIcon } from 'lucide-react';

const cartItems = [
    { id: 1, title: 'Product 1', href: '#', icon: PackageIcon },
    {
        id: 2,
        title: 'test@example.com',
        href: '#',
        icon: PackageIcon,
    },
    {
        id: 3,
        title: 'Product 3',
        href: '#',
        icon: PackageIcon,
    },
];

export function AppSidebarRight() {
    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            collapsible="offcanvas"
            variant="floating"
            name="right"
            side="right"
        >
            <SidebarContent className="py-4">
                {cartItems.map((item) => (
                    <a
                        key={item.title}
                        href={item.href}
                        className="hover:bg-sidebar-hover flex items-center gap-3 rounded-md border-b px-4 py-2 text-sm font-medium text-sidebar-foreground last:border-transparent"
                    >
                        {item.icon && (
                            <item.icon className="size-4 text-sidebar-foreground" />
                        )}
                        {item.title}
                    </a>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}
