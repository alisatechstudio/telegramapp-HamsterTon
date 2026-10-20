import { Wallet, CheckCircle, Clock, ShieldCheck, Zap } from 'lucide-react';

export function AirdropView({ state, profitPerHour, onConnectWallet, user }) {
  const isWalletConnected = Boolean(state.walletAddress);

  const formatNumber = (num) => num.toLocaleString();

  // Criteria validation
  const isProfitQualified = profitPerHour >= 1000;
  const isStreakQualified = state.streakDay >= 3;
  const isTasksQualified = state.completedTasks.length >= 2;

  return (
    <div className="airdrop-view-container" id="airdrop-view">
      {/* Hero Card */}
      <div className="airdrop-hero-card">
        <div className="airdrop-title">Hamster TON Airdrop</div>
        <div className="airdrop-desc">
          Connect your TON Web3 wallet to prepare for the upcoming $HMSTR token generation event.
          Allocation is calculated based on profit per hour and active participation.
        </div>

        {isWalletConnected ? (
          <div className="wallet-connected-badge" onClick={onConnectWallet} style={{ cursor: 'pointer' }}>
            <CheckCircle size={16} />
            <span>Connected: {state.walletAddress}</span>
            <span style={{ fontSize: 10, textDecoration: 'underline', marginLeft: 4 }}>Disconnect</span>
          </div>
        ) : (
          <button className="wallet-connect-btn" onClick={onConnectWallet} id="btn-connect-ton-wallet">
            <Wallet size={18} />
            Connect TON Wallet
          </button>
        )}
      </div>

      {/* TGE Countdown Pill */}
      <div className="stat-pill" style={{ marginBottom: 14, flexDirection: 'row', gap: 10, padding: 10 }}>
        <Clock size={16} color="#00f2fe" />
        <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>
          Season 1 Token Generation Event (TGE): <span style={{ color: '#ffd700' }}>14 Days 08:42:19</span>
        </span>
      </div>

      {/* Allocation Criteria Checklist */}
      <div className="airdrop-criteria-box">
        <div className="criteria-title">Eligibility Criteria</div>

        {/* 1. Profit per hour */}
        <div className="criteria-item">
          <div>
            <div style={{ fontWeight: 600 }}>Profit per Hour (&gt; 1,000/hr)</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Current: +{formatNumber(profitPerHour)} / hr
            </div>
          </div>
          <span className={`criteria-status ${isProfitQualified ? 'ready' : 'pending'}`}>
            {isProfitQualified ? 'Qualified ✓' : 'Keep Mining'}
          </span>
        </div>

        {/* 2. Tasks completed */}
        <div className="criteria-item">
          <div>
            <div style={{ fontWeight: 600 }}>Community Quests (2+ Tasks)</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Completed: {state.completedTasks.length} quests
            </div>
          </div>
          <span className={`criteria-status ${isTasksQualified ? 'ready' : 'pending'}`}>
            {isTasksQualified ? 'Qualified ✓' : 'Do Quests'}
          </span>
        </div>

        {/* 3. Daily check-in */}
        <div className="criteria-item">
          <div>
            <div style={{ fontWeight: 600 }}>Daily Activity Streak</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Streak: Day {state.streakDay}
            </div>
          </div>
          <span className={`criteria-status ${isStreakQualified ? 'ready' : 'pending'}`}>
            {isStreakQualified ? 'Qualified ✓' : 'Day 3+ Required'}
          </span>
        </div>

        {/* 4. TON Wallet */}
        <div className="criteria-item">
          <div>
            <div style={{ fontWeight: 600 }}>TON Web3 Wallet Address</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              {isWalletConnected ? state.walletAddress : 'Not connected'}
            </div>
          </div>
          <span className={`criteria-status ${isWalletConnected ? 'ready' : 'pending'}`}>
            {isWalletConnected ? 'Connected ✓' : 'Action Needed'}
          </span>
        </div>

        {/* 5. Telegram Premium Bonus */}
        <div className="criteria-item">
          <div>
            <div style={{ fontWeight: 600 }}>Telegram Premium Multiplier</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              {user?.isPremium ? 'Premium status detected (+20% bonus)' : 'Standard Telegram user'}
            </div>
          </div>
          <span className="criteria-status ready">
            {user?.isPremium ? '+20% Active' : 'Available'}
          </span>
        </div>
      </div>
    </div>
  );
}
