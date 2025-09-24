import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { myDomains } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import * as React from 'react';
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

function MyDomains() {
    return (
        <>
            <Head title="My Domains" />
            <div className="p-4">
                <div className="mb-4 flex flex-1 flex-col gap-4">
                    <Tabs defaultValue="all">
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
                        {tabs.map((tab) => (
                            <TabsContent key={tab.value} value={tab.value}>
                                <MyDomainsTable />
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>
        </>
    );
}

MyDomains.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default MyDomains;
