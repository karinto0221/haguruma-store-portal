import type { FormEventHandler, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MasterFormDialogLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitting: boolean;
  error: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

export default function MasterFormDialogLayout({
  open,
  onOpenChange,
  title,
  submitting,
  error,
  onSubmit,
  children,
}: MasterFormDialogLayoutProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="master-form-dialog">
        <form className="master-form" onSubmit={onSubmit}>
          <DialogHeader className="master-form-header">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="master-form-body">
            {children}
            {error && <div className="error-box">{error}</div>}
          </div>
          <DialogFooter className="master-form-footer">
            <DialogClose asChild>
              <Button type="button" variant="link">
                キャンセル
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
