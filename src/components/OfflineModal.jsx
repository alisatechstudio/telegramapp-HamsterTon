import { TrendingUp, Coins } from 'lucide-react';

export function OfflineModal({ offlineEarnings, onClaim }) {
  if (!offlineEarnings) return null;

  const minutesAway = Math.max(1, Math.floor(offlineEarnings.seconds / 60));
  const formatCoins = offlineEarnings.coins.toLocaleString();

  return (
    <div className="modal-overlay" id="offline-profit-modal">
      <div className="modal-card">
        <div className="modal-icon-badge">
          <Coins size={32} />
        </div>
        <div className="modal-title">Welcome Back, CEO!</div>
        <div className="modal-desc">
          While you were away for {minutesAway} minutes, your automated mining operations kept running non-stop.
        </div>

        <div className="modal-amount-highlight">
          <span>🪙</span>
          <span>+{formatCoins}</span>
        </div>

        <button className="modal-claim-btn" onClick={onClaim} id="btn-claim-offline-profit">
          Thank you, Hamster Team!
        </button>
      </div>
    </div>
  );
}
