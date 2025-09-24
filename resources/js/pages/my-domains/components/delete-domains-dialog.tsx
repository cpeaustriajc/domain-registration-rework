import type { Row } from '@tanstack/react-table';
import { Loader, Trash } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
interface DeleteDomainsDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  domains: Row<unknown>['original'][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteDomainsDialog({
  domains,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteDomainsDialogProps) {
  const [isPending, startTransition] = React.useTransition();
  const isMobile = useIsMobile();

  function onDelete() {
    if (domains.length === 0) return;
    startTransition(() => {
      setTimeout(() => {
        toast.success(
          `Deleted ${domains.length} domain${domains.length === 1 ? '' : 's'} (mock)`
        );
        props.onOpenChange?.(false);
        onSuccess?.();
      }, 500);
    });
  }

  if (!isMobile) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Delete ({domains.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete selected domains?</DialogTitle>
            <DialogDescription>
              This is a mock action. It will simply clear the current selection.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected domains"
              variant="destructive"
              onClick={onDelete}
              disabled={isPending}
            >
              {isPending && (
                <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Delete ({domains.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Delete selected domains?</DrawerTitle>
          <DrawerDescription>
            This is a mock action. It will simply clear the current selection.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected domains"
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
          >
            {isPending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
