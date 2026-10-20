import { Zap, TrendingUp, Gift, Trophy, Wallet } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

export function NavigationDock({ activeTab, onSelectTab, completedTasksCount }) {
  const tabs = [
    { id: 'mine', label: 'Mine', icon: Zap },
    { id: 'upgrades', label: 'Upgrades', icon: TrendingUp },
    { id: 'earn', label: 'Earn', icon: Gift },
    { id: 'leaderboard', label: 'Leaders', icon: Trophy },
    { id: 'airdrop', label: 'Airdrop', icon: Wallet },
  ];

  const handleTabClick = (tabId) => {
    triggerHaptic('selection');
    onSelectTab(tabId);
  };

  return (
    <nav className="bottom-dock" id="bottom-navigation-dock">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            className={`dock-item ${isActive ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            id={`tab-btn-${tab.id}`}
          >
            <div className="dock-icon-wrapper">
              <IconComponent size={20} />
            </div>
            <span className="dock-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
