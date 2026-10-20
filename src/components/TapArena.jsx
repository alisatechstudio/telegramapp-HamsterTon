import { useState, useRef } from 'react';
import { Zap, Rocket, Award, TrendingUp, Sparkles, Flame } from 'lucide-react';

export function TapArena({
  state,
  currentLevel,
  nextLevel,
  profitPerHour,
  earnPerTap,
  turboActive,
  comboCount,
  onTap,
  onUseRefill,
  onActivateTurbo,
}) {
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTapped, setIsTapped] = useState(false);
  const containerRef = useRef(null);

  // Trigger floating numbers and tilt on tap
  const triggerTapVisuals = (clientX, clientY) => {
    const result = onTap(clientX, clientY);
    if (!result) return;

    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [
      ...prev.slice(-15), // keep max 15 floating numbers to maintain high 60fps performance
      { id, x: clientX, y: clientY, amount: result.amount, isCritical: result.isCritical },
    ]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 850);

    // Apply quick 3D tilt based on tap offset from mascot center
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const tiltX = (clientY - centerY) / 8;
      const tiltY = (centerX - clientX) / 8;
      setTilt({ x: tiltX, y: tiltY });
      setIsTapped(true);
      setTimeout(() => {
        setTilt({ x: 0, y: 0 });
        setIsTapped(false);
      }, 100);
    }
  };

  // Multi-touch handler for mobile tapping
  const handleTouchStart = (e) => {
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      triggerTapVisuals(touch.clientX, touch.clientY);
    }
  };

  const handleClick = (e) => {
    triggerTapVisuals(e.clientX, e.clientY);
  };

  // Calculate level progress
  const currentLevelMin = currentLevel?.minCoins || 0;
  const nextLevelMin = nextLevel?.minCoins || currentLevelMin * 2;
  const levelRange = Math.max(1, nextLevelMin - currentLevelMin);
  const currentProgressCoins = Math.max(0, state.totalEarned - currentLevelMin);
  const progressPercent = Math.min(100, Math.round((currentProgressCoins / levelRange) * 100));

  // Format large numbers cleanly
  const formatCompact = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return Math.floor(num).toLocaleString();
  };

  return (
    <div className="tap-tab-container" id="tap-arena-view">
      {/* Top 3 Quick Stats */}
      <div className="stats-strip">
        <div className="stat-pill">
          <span className="stat-pill-label">
            <TrendingUp size={12} color="#00f2fe" /> Profit / Hour
          </span>
          <span className="stat-pill-value cyan">+{formatCompact(profitPerHour)}</span>
        </div>

        <div className="stat-pill">
          <span className="stat-pill-label">
            <Zap size={12} color="#ffd700" /> Per Tap
          </span>
          <span className="stat-pill-value gold">+{earnPerTap}</span>
        </div>

        <div className="stat-pill">
          <span className="stat-pill-label">
            <Award size={12} color="#f59e0b" /> League
          </span>
          <span className="stat-pill-value">
            {currentLevel?.badge} {currentLevel?.level}/8
          </span>
        </div>
      </div>

      {/* Level Progress Banner */}
      <div className="level-banner">
        <div className="level-banner-top">
          <div className="level-name" style={{ color: currentLevel?.color }}>
            <span>{currentLevel?.badge}</span>
            <span>{currentLevel?.name}</span>
          </div>
          <div className="level-counter">
            {nextLevel ? `${progressPercent}%` : 'MAX RANK'}
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Balance Hero */}
      <div className="balance-hero">
        <div className="balance-amount-row">
          <img
            src="/crypto_gold_coin.jpg"
            alt="Gold Coin"
            className="balance-coin-icon"
          />
          <span className="balance-value" id="user-balance-display">
            {Math.floor(state.coins).toLocaleString()}
          </span>
        </div>
        <div className="balance-rank-badge">
          {comboCount > 5 ? (
            <span style={{ color: '#ff007f', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Flame size={14} /> {comboCount}x COMBO RUSH!
            </span>
          ) : (
            <>
              <Sparkles size={12} color="#ffd700" /> Total Mined: {formatCompact(state.totalEarned)} Coins
            </>
          )}
        </div>
      </div>

      {/* Hero Tap Arena */}
      <div className="tap-arena">
        <div
          ref={containerRef}
          className="mascot-tap-wrapper"
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          id="mascot-tap-target"
        >
          <div className="mascot-halo" />
          <div className="mascot-outer-ring" />
          <div
            className={`mascot-avatar-container ${isTapped ? 'tapped' : ''}`}
            style={{
              transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isTapped ? 0.94 : 1})`,
            }}
          >
            <img
              src="/mascot_hamster.jpg"
              alt="Hamster CEO Tap"
              className="mascot-avatar-img"
            />
          </div>
        </div>
      </div>

      {/* Floating Damage / Coin Numbers */}
      {floatingTexts.map((f) => (
        <div
          key={f.id}
          className={`floating-number ${f.isCritical ? 'critical' : ''}`}
          style={{ left: `${f.x}px`, top: `${f.y}px` }}
        >
          +{f.amount}
          {f.isCritical && ' 🔥'}
        </div>
      ))}

      {/* Energy Status Bar */}
      <div className="energy-bar-section">
        <div className="energy-info-row">
          <span className="energy-label">
            <Zap size={14} fill="#ffd700" /> Energy
          </span>
          <span className="energy-count">
            {state.energy} / {state.maxEnergy}
          </span>
        </div>
        <div className="energy-track">
          <div
            className="energy-fill"
            style={{ width: `${(state.energy / state.maxEnergy) * 100}%` }}
          />
        </div>
      </div>

      {/* Boosters Quick Grid */}
      <div className="boosters-grid">
        <button
          className="booster-btn"
          onClick={onUseRefill}
          disabled={state.freeRefillsRemaining <= 0 || state.energy >= state.maxEnergy}
          id="btn-refill-energy"
        >
          <div className="booster-icon-box gold">
            <Zap size={18} />
          </div>
          <div className="booster-text">
            <span className="booster-name">Full Energy</span>
            <span className="booster-sub">{state.freeRefillsRemaining}/3 Daily Free</span>
          </div>
        </button>

        <button
          className={`booster-btn ${turboActive ? 'turbo-active' : ''}`}
          onClick={onActivateTurbo}
          disabled={turboActive}
          id="btn-activate-turbo"
        >
          <div className="booster-icon-box turbo">
            <Rocket size={18} />
          </div>
          <div className="booster-text">
            <span className="booster-name">{turboActive ? 'TURBO ACTIVE!' : 'Turbo Boost'}</span>
            <span className="booster-sub">{turboActive ? '5x Multiplier' : 'Activate 5x Tap'}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
