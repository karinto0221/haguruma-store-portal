interface UpdateHistoryHeaderProps {
  version: string;
}

export default function UpdateHistoryHeader({ version }: UpdateHistoryHeaderProps) {
  return (
    <div className="update-history-heading">
      <div>
        <div className="header">
          <span className="kicker">UPDATES</span>
          <h1>更新情報</h1>
        </div>
        <p className="subtitle">追加・改善された機能をバージョンごとに確認できます。</p>
      </div>
      <div className="update-version-pill" aria-label={`現在のバージョン ${version}`}>
        <span className="update-version-pill-label">CURRENT</span>
        <strong>v{version}</strong>
      </div>
    </div>
  );
}
