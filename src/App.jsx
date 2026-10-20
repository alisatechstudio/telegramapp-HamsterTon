import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { initTelegramApp, getTelegramUser, isTelegramWebApp } from './utils/telegram';
import { Header } from './components/Header';
import { TapArena } from './components/TapArena';
import { UpgradesView } from './components/UpgradesView';
import { EarnView } from './components/EarnView';
import { LeaderboardView } from './components/LeaderboardView';
import { AirdropView } from './components/AirdropView';
import { NavigationDock } from './components/NavigationDock';
import { OfflineModal } from './components/OfflineModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('mine');
  const [user, setUser] = useState(null);
  const [isFrameMode, setIsFrameMode] = useState(true);

  const {
    state,
    currentLevel,
    nextLevel,
    profitPerHour,
    earnPerTap,
    turboActive,
    comboCount,
    offlineEarnings,
    handleTap,
    buyUpgrade,
    getUpgradeCost,
    claimDailyReward,
    completeTask,
    useFullEnergyRefill,
    activateTurbo,
    toggleWalletConnection,
    claimOfflineEarnings,
    toggleSound,
  } = useGameState();

  // Initialize Telegram WebApp on startup
  useEffect(() => {
    initTelegramApp();
    const tgUser = getTelegramUser();
    setUser(tgUser);

    // If running directly inside Telegram client, adapt to full screen
    if (isTelegramWebApp()) {
      setIsFrameMode(false);
    }
  }, []);

  return (
    <div className="tma-wrapper">
      {/* Background Ambience Glows */}
      <div className="bg-glow-orb-top" />
      <div className="bg-glow-orb-center" />

      {/* Main Container (either Telegram Phone Simulator or Full Window) */}
      <div
        className="device-container"
        style={!isFrameMode ? { maxWidth: '100%', height: '100vh', borderRadius: 0, border: 'none' } : {}}
      >
        {/* Telegram App Header */}
        <Header
          user={user}
          soundMuted={state.soundMuted}
          toggleSound={toggleSound}
          isFrameMode={isFrameMode}
          toggleFrameMode={() => setIsFrameMode((prev) => !prev)}
        />

        {/* Scrollable Viewport */}
        <main className="app-content">
          {activeTab === 'mine' && (
            <TapArena
              state={state}
              currentLevel={currentLevel}
              nextLevel={nextLevel}
              profitPerHour={profitPerHour}
              earnPerTap={earnPerTap}
              turboActive={turboActive}
              comboCount={comboCount}
              onTap={handleTap}
              onUseRefill={useFullEnergyRefill}
              onActivateTurbo={activateTurbo}
            />
          )}

          {activeTab === 'upgrades' && (
            <UpgradesView
              state={state}
              profitPerHour={profitPerHour}
              onBuyUpgrade={buyUpgrade}
              getUpgradeCost={getUpgradeCost}
            />
          )}

          {activeTab === 'earn' && (
            <EarnView
              state={state}
              onClaimStreak={claimDailyReward}
              onCompleteTask={completeTask}
              onConnectWallet={toggleWalletConnection}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardView
              state={state}
              currentLevel={currentLevel}
              user={user}
            />
          )}

          {activeTab === 'airdrop' && (
            <AirdropView
              state={state}
              profitPerHour={profitPerHour}
              onConnectWallet={toggleWalletConnection}
              user={user}
            />
          )}
        </main>

        {/* Fixed Telegram Bottom Dock */}
        <NavigationDock
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          completedTasksCount={state.completedTasks.length}
        />

        {/* Offline Earnings Popup Modal */}
        <OfflineModal
          offlineEarnings={offlineEarnings}
          onClaim={claimOfflineEarnings}
        />
      </div>
    </div>
  );
}
