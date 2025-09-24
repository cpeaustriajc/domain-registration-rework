import { Loader, Plus } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function BuyNewDomainSheet() {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [domainName, setDomainName] = React.useState('');
  const [tld, setTld] = React.useState('com');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!domainName.trim()) {
      toast.error('Please enter a domain name');
      return;
    }
    startTransition(() => {
      setTimeout(() => {
        toast.success(`Mock purchased ${domainName}.${tld}`);
        setDomainName('');
        setTld('com');
        setOpen(false);
      }, 650);
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus />
          Buy domain
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Buy a new domain</SheetTitle>
          <SheetDescription>
            This is a mock flow. No real registration occurs yet.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="domainName">Domain name</label>
            <input
              id="domainName"
              className="h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="example"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="tld">TLD</label>
            <select
              id="tld"
              className="h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={tld}
              onChange={(e) => setTld(e.target.value)}
            >
              {['com','net','org','io','dev'].map(x => <option key={x} value={x}>{'.'+x}</option>)}
            </select>
          </div>
          <SheetFooter className="gap-2 pt-2 sm:space-x-0">
            <SheetClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </SheetClose>
            <Button disabled={isPending || !domainName.trim()} type="submit">
              {isPending && <Loader className="animate-spin" />}
              Purchase
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
