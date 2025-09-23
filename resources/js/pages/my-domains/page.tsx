import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { myDomains } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    FilterIcon,
    SearchIcon,
} from 'lucide-react';
import { columns } from './columns';
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Domains',
        href: myDomains().url,
    },
];

const allData = [
    {
        id: 1,
        name: 'example.com',
        nameservers: [
            'ns1.example.com',
            'ns2.example.com',
            'ns3.example.com',
            'ns4.example.com',
            'ns5.example.com',
            'ns6.example.com',
        ],
        status: 'Active',
        category: 'Business',
        created_at: '2023-01-01',
        expiration_at: '2024-12-31',
    },
    {
        id: 2,
        name: 'mywebsite.net',
        nameservers: ['ns1.mywebsite.net', 'ns2.mywebsite.net'],
        status: 'Pending',
        category: 'Personal',
        created_at: '2023-01-01',
        expiration_at: '2025-06-15',
    },
    {
        id: 3,
        name: 'testdomain.org',
        nameservers: ['ns1.testdomain.org', 'ns2.testdomain.org'],
        status: 'Expired',
        category: 'Other',
        created_at: '2023-01-01',
        expiration_at: '2023-08-20',
    },
];

const activeData = allData.filter((domain) => domain.status === 'Active');
const pendingData = allData.filter((domain) => domain.status === 'Pending');
const expiredData = allData.filter((domain) => domain.status === 'Expired');
const redemptionData = allData.filter(
    (domain) => domain.status === 'Redemption',
);

const tabs = [
    { title: 'All', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Pending', value: 'pending' },
    { title: 'Expired', value: 'expired' },
    { title: 'Redemption', value: 'redemption' },
];

const filters = [
    { column: 'status', value: 'active', label: 'Active' },
    { column: 'status', value: 'pending', label: 'Pending' },
    { column: 'status', value: 'expired', label: 'Expired' },
    { column: 'status', value: 'redemption', label: 'Redemption' },
];

export default function MyDomains() {
    const dataTableFooter = (
        <div className="mt-4 flex items-center justify-between">
            <p>Total Domains: {allData.length}</p>

            <div className="flex items-center gap-2">
                <span>Items per page</span>
                <Select>
                    <SelectTrigger className="w-[80px]">10</SelectTrigger>
                    <SelectContent align="end">
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                    <ChevronLeftIcon className="size-4" />
                </Button>
                <Button variant="outline" size="icon">
                    <ChevronRightIcon className="size-4" />
                </Button>
            </div>
        </div>
    );

    const dataTableHeader = (
        <div className="my-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <span>Filter:</span>
                <div className="flex items-center gap-2">
                    {filters.map((filter) => (
                        <Button key={filter.value} variant="outline" size="sm">
                            {filter.label}
                        </Button>
                    ))}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon">
                            <FilterIcon className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {filters.map((filter) => (
                            <DropdownMenuItem key={filter.value}>
                                {filter.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="relative">
                <Input
                    className="peer max-w-sm ps-9"
                    placeholder="Search domains..."
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <SearchIcon size={16} aria-hidden="true" />
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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
                        <TabsContent value="all">
                            {dataTableHeader}
                            <DataTable columns={columns} data={allData} />
                            {dataTableFooter}
                        </TabsContent>
                        <TabsContent value="active">
                            {dataTableHeader}
                            <DataTable columns={columns} data={activeData} />
                            {dataTableFooter}
                        </TabsContent>
                        <TabsContent value="pending">
                            {dataTableHeader}
                            <DataTable columns={columns} data={pendingData} />
                            {dataTableFooter}
                        </TabsContent>
                        <TabsContent value="expired">
                            {dataTableHeader}
                            <DataTable columns={columns} data={expiredData} />
                            {dataTableFooter}
                        </TabsContent>
                        <TabsContent value="redemption">
                            {dataTableHeader}
                            <DataTable
                                columns={columns}
                                data={redemptionData}
                            />
                            {dataTableFooter}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
