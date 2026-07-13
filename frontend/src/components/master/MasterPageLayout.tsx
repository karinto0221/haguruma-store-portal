import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface MasterPageLayoutProps {
  title: string;
  description: string;
  createDisabled?: boolean;
  onCreate: () => void;
  children: ReactNode;
}

export default function MasterPageLayout({
  title,
  description,
  createDisabled = false,
  onCreate,
  children,
}: MasterPageLayoutProps) {
  return (
    <div className="page page-master master-management-page">
      <div className="header master-page-header">
        <span className="kicker">MASTER</span>
        <h1>{title}</h1>
        <Button
          className="master-create-button"
          onClick={onCreate}
          disabled={createDisabled}
        >
          新規作成
        </Button>
      </div>
      <p className="subtitle">{description}</p>
      {children}
    </div>
  );
}
