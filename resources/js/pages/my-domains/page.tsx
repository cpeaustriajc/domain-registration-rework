import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { myDomains } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import * as React from 'react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { MyDomainsTable } from './components/my-domains-table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Domains', href: myDomains().url },
];

const tabs = [
    { title: 'All', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Pending', value: 'pending' },
    { title: 'Expired', value: 'expired' },
    { title: 'Redemption', value: 'redemption' },
];

const statusValueMap: Record<string, string> = {
    active: 'Active',
    pending: 'Pending',
    expired: 'Expired',
    redemption: 'Redemption',
};

function useStatusTabState() {
    const [statusFilter, setStatusFilter] = useQueryState(
        'status',
        parseAsArrayOf(parseAsString).withDefault([]),
    );

    const currentTab = React.useMemo(() => {
        if (statusFilter.length === 1) {
            const single = statusFilter[0];
            const entry = Object.entries(statusValueMap).find(
                ([, v]) => v === single,
            );
            if (entry) return entry[0];
        }
        return 'all';
    }, [statusFilter]);

    const setTab = React.useCallback(
        (value: string) => {
            if (value === 'all') {
                void setStatusFilter(null);
                return;
            }
            const mapped = statusValueMap[value];
            if (mapped) {
                void setStatusFilter([mapped]);
            } else {
                void setStatusFilter(null);
            }
        },
        [setStatusFilter],
    );

    return { currentTab, setTab };
}

function MyDomains() {
    const { currentTab, setTab } = useStatusTabState();
    return (
        <>
            <Head title="My Domains" />
            <div className="p-4">
                <div className="mb-4 flex flex-1 flex-col gap-4">
                    <Tabs value={currentTab} onValueChange={setTab}>
                        <TabsList className="mb-2 bg-transparent">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
                                >
                                    {tab.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {tabs.map((tab) => {
                            const statusOverride = (
                                tab.value === 'all'
                                    ? []
                                    : [statusValueMap[tab.value]].filter(
                                          Boolean,
                                      )
                            ) as Array<
                                | 'Active'
                                | 'Pending'
                                | 'Expired'
                                | 'Redemption'
                            >;
                            return (
                                <TabsContent
                                    key={tab.value}
                                    value={tab.value}
                                >
                                    <MyDomainsTable
                                        statusFilterOverride={statusOverride}
                                    />
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </div>
            </div>
        </>
    );
}

// Do this for the other layouts that use Nuqs too
MyDomains.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default MyDomains;
