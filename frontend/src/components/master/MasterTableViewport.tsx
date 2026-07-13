import type { ReactNode } from 'react';

export default function MasterTableViewport({ children }: { children: ReactNode }) {
  return <div className="master-table-viewport">{children}</div>;
}
