import { useState } from 'react';
import {
  Cpu,
  Flame,
  Sun,
  Radio,
  Repeat,
  Layers,
  Bot,
  BarChart2,
  Send,
  Mic,
  Share2,
  Trophy,
  ShieldCheck,
  Users,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { UPGRADE_CATEGORIES, UPGRADE_CARDS } from '../data/gameData';

const ICON_MAP = {
  Cpu,
  Flame,
  Sun,
  Radio,
  Repeat,
  Layers,
  Bot,
  BarChart2,
  Send,
  Mic,
  Share2,
  Trophy,
  ShieldCheck,
  Users,
  Globe,
  TrendingUp,
};

export function UpgradesView({ state, profitPerHour, onBuyUpgrade, getUpgradeCost }) {
  const [selectedCategory, setSelectedCategory] = useState('mining');

  const filteredCards = UPGRADE_CARDS.filter((c) => c.categoryId === selectedCategory);

  const formatNumber = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="upgrades-view-container" id="upgrades-view">
      {/* Profit per hour summary banner */}
      <div className="stat-pill" style={{ marginBottom: 14, padding: 12 }}>
        <span className="stat-pill-label">
          <TrendingUp size={14} color="#00f2fe" /> Total Mining Rate
        </span>
        <span className="stat-pill-value cyan" style={{ fontSize: 20 }}>
          +{formatNumber(profitPerHour)} coins / hr
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="category-filter-row">
        {UPGRADE_CATEGORIES.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || Cpu;
          return (
            <button
              key={cat.id}
              className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              id={`filter-cat-${cat.id}`}
            >
              <IconComponent size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Cards List */}
      <div className="upgrade-cards-list">
        {filteredCards.map((card) => {
          const IconComponent = ICON_MAP[card.icon] || Cpu;
          const currentLevel = state.upgrades[card.id] || 0;
          const cost = getUpgradeCost(card.id);
          const canAfford = state.coins >= cost;
          const nextProfitGain = card.baseProfitPerHour;

          return (
            <div key={card.id} className="upgrade-card" id={`card-${card.id}`}>
              <div className="upgrade-card-left">
                <div className="upgrade-card-icon">
                  <IconComponent size={22} />
                </div>
                <div className="upgrade-card-info">
                  <div className="upgrade-card-title">{card.title}</div>
                  <div className="upgrade-card-stats">
                    <span className="upgrade-level-badge">Lvl {currentLevel}</span>
                    <span className="upgrade-profit-tag">+{formatNumber(nextProfitGain)} / hr</span>
                  </div>
                </div>
              </div>

              <button
                className="upgrade-buy-btn"
                onClick={() => onBuyUpgrade(card.id)}
                disabled={!canAfford}
                id={`buy-${card.id}`}
              >
                <span className="buy-btn-label">Upgrade</span>
                <span className="buy-btn-cost">🪙 {formatNumber(cost)}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
