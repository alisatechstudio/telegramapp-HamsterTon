import { Trophy, Crown, Sparkles } from 'lucide-react';
import { MOCK_LEADERBOARD } from '../data/gameData';

export function LeaderboardView({ state, currentLevel, user }) {
  const formatCompact = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return Math.floor(num).toLocaleString();
  };

  // Build combined leaderboard with current user
  const userEntry = {
    rank: 11,
    name: user?.firstName || 'You (CEO)',
    balance: Math.floor(state.totalEarned),
    tier: currentLevel.name,
    badge: currentLevel.badge,
    isUser: true,
  };

  return (
    <div className="leaderboard-view-container" id="leaderboard-view">
      {/* Top Banner */}
      <div className="airdrop-hero-card" style={{ marginBottom: 14 }}>
        <Trophy size={36} color="#ffd700" style={{ margin: '0 auto 8px auto' }} />
        <div className="airdrop-title">Global CEO Rankings</div>
        <div className="airdrop-desc">
          Top 1,000 CEOs will receive the exclusive Season 1 $HMSTR TON Airdrop allocation.
        </div>
      </div>

      {/* Your Standing Card */}
      <div className="criteria-title" style={{ marginBottom: 8 }}>Your Rank</div>
      <div className="leaderboard-row current-user" style={{ marginBottom: 14 }}>
        <div className="leaderboard-left">
          <div className="leaderboard-rank top-1">
            <Crown size={20} color="#ffd700" />
          </div>
          <div className="leaderboard-user-details">
            <div className="leaderboard-username">
              {userEntry.name}
              <span style={{ fontSize: 11, background: '#ffd700', color: '#000', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>
                YOU
              </span>
            </div>
            <div className="leaderboard-tier">
              {userEntry.badge} {userEntry.tier}
            </div>
          </div>
        </div>

        <div className="leaderboard-balance">
          🪙 {formatCompact(userEntry.balance)}
        </div>
      </div>

      {/* Global Top 10 */}
      <div className="criteria-title" style={{ marginBottom: 8 }}>Top 10 Leaders</div>
      <div className="leaderboard-container">
        {MOCK_LEADERBOARD.map((item) => (
          <div key={item.rank} className="leaderboard-row" id={`leaderboard-rank-${item.rank}`}>
            <div className="leaderboard-left">
              <div
                className={`leaderboard-rank ${
                  item.rank === 1 ? 'top-1' : item.rank === 2 ? 'top-2' : item.rank === 3 ? 'top-3' : ''
                }`}
              >
                #{item.rank}
              </div>
              <div className="leaderboard-user-details">
                <div className="leaderboard-username">{item.name}</div>
                <div className="leaderboard-tier">
                  {item.badge} {item.tier}
                </div>
              </div>
            </div>

            <div className="leaderboard-balance">
              🪙 {formatCompact(item.balance)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
