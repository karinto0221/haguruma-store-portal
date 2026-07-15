import UpdateHistoryHeader from './component/UpdateHistoryHeader';
import UpdateHistoryList from './component/UpdateHistoryList';
import { CURRENT_APP_VERSION, UPDATE_HISTORY } from './data/updateHistory';

export default function UpdateHistory() {
  return (
    <div className="page page-wide update-history-page">
      <UpdateHistoryHeader version={CURRENT_APP_VERSION} />
      <UpdateHistoryList entries={UPDATE_HISTORY} />
    </div>
  );
}
