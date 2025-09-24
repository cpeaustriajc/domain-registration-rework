import { Loader } from 'lucide-react';
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
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface UpdateDomainsSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  domainIds: (string | number)[];
  initialStatus?: string;
  initialNote?: string;
  onUpdated?: (data: { ids: (string | number)[]; status: string; note: string }) => void;
}

export function UpdateDomainsSheet({
  domainIds,
  initialStatus = 'Active',
  initialNote = '',
  onUpdated,
  ...props
}: UpdateDomainsSheetProps) {
  const [isPending, startTransition] = React.useTransition();
  const [status, setStatus] = React.useState(initialStatus);
  const [note, setNote] = React.useState(initialNote);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (domainIds.length === 0) return;
    startTransition(() => {
      setTimeout(() => {
        onUpdated?.({ ids: domainIds, status, note });
        toast.success(`Updated ${domainIds.length} domain${domainIds.length === 1 ? '' : 's'} (mock)`);
        props.onOpenChange?.(false);
      }, 600);
    });
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update domains</SheetTitle>
          <SheetDescription>
            Mock update: adjust status or add notes for the selected domains.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="status" className="text-sm font-medium">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {['Active','Pending','Expired','Redemption'].map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="note" className="text-sm font-medium">Internal note</Label>
            <Textarea
              id="note"
              placeholder="Optional note…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <SheetFooter className="gap-2 pt-2 sm:space-x-0">
            <SheetClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </SheetClose>
            <Button disabled={isPending || domainIds.length === 0} type="submit">
              {isPending && (
                <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
              )}
              Save
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// Backwards compatibility export if something still imports UpdateTaskSheet
export const UpdateTaskSheet = UpdateDomainsSheet;
