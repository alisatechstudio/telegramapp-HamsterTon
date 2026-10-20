import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GAME_LEVELS, UPGRADE_CARDS, DAILY_STREAK_REWARDS, EARN_TASKS } from '../data/gameData';
import { triggerHaptic } from '../utils/telegram';
import { sounds } from '../utils/soundEffects';

const STORAGE_KEY = 'hamster_ton_empire_v1_save';

const DEFAULT_STATE = {
  coins: 2500, // Starter coins
  totalEarned: 2500,
  energy: 1500,
  maxEnergy: 1500,
  upgrades: {}, // { [upgradeId]: level }
  streakDay: 1,
  lastStreakClaim: null,
  completedTasks: [],
  walletAddress: null,
  soundMuted: false,
  freeRefillsRemaining: 3,
  lastRefillDate: null,
  lastTimestamp: Date.now(),
};

export function useGameState() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load save state:', e);
    }
    return DEFAULT_STATE;
  });

  const [turboActive, setTurboActive] = useState(false);
  const [offlineEarnings, setOfflineEarnings] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(GAME_LEVELS[0]);
  const [nextLevel, setNextLevel] = useState(GAME_LEVELS[1]);
  const [comboCount, setComboCount] = useState(0);
  const comboTimerRef = useRef(null);

  // Calculate profit per hour based on current upgrades
  const profitPerHour = Object.entries(state.upgrades).reduce((total, [cardId, level]) => {
    const card = UPGRADE_CARDS.find((c) => c.id === cardId);
    if (!card || level <= 0) return total;
    // Each level provides base profit * level
    return total + Math.floor(card.baseProfitPerHour * level);
  }, 0);

  // Determine current player rank level
  useEffect(() => {
    let curr = GAME_LEVELS[0];
    let next = GAME_LEVELS[1] || null;

    for (let i = GAME_LEVELS.length - 1; i >= 0; i--) {
      if (state.totalEarned >= GAME_LEVELS[i].minCoins) {
        curr = GAME_LEVELS[i];
        next = GAME_LEVELS[i + 1] || null;
        break;
      }
    }
    setCurrentLevel(curr);
    setNextLevel(next);
  }, [state.totalEarned]);

  // Offline earnings calculation on mount
  useEffect(() => {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - (state.lastTimestamp || now)) / 1000);
    
    // Only award offline earnings if elapsed time > 60 seconds and profitPerHour > 0
    if (elapsedSeconds > 60 && profitPerHour > 0) {
      // Max 3 hours offline earnings cap (10800 seconds)
      const cappedSeconds = Math.min(elapsedSeconds, 10800);
      const earned = Math.floor((profitPerHour / 3600) * cappedSeconds);
      if (earned > 0) {
        setOfflineEarnings({
          coins: earned,
          seconds: cappedSeconds,
        });
      }
    }
  }, []);

  // Save state to localStorage whenever changed
  useEffect(() => {
    const saveCopy = { ...state, lastTimestamp: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveCopy));
    } catch {
      // storage quota or private mode
    }
  }, [state]);

  // Passive profit per second accumulator & energy regeneration ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        // Regenerate energy (+3 per sec, capped at maxEnergy)
        const newEnergy = Math.min(prev.maxEnergy, prev.energy + 3);

        // Passive coin generation (profitPerHour / 3600)
        let newCoins = prev.coins;
        let newTotal = prev.totalEarned;
        if (profitPerHour > 0) {
          const perSec = profitPerHour / 3600;
          newCoins += perSec;
          newTotal += perSec;
        }

        return {
          ...prev,
          energy: newEnergy,
          coins: newCoins,
          totalEarned: newTotal,
          lastTimestamp: Date.now(),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [profitPerHour]);

  // Turbo boost timer countdown
  useEffect(() => {
    if (!turboActive) return;
    const timer = setTimeout(() => {
      setTurboActive(false);
    }, 20000); // 20s turbo boost
    return () => clearTimeout(timer);
  }, [turboActive]);

  // Calculate earn per tap based on level and turbo
  const baseTapPower = currentLevel.tapPower || 1;
  const earnPerTap = baseTapPower * (turboActive ? 5 : 1);

  // Tap handler
  const handleTap = useCallback(
    (clientX, clientY) => {
      if (state.energy <= 0) {
        triggerHaptic('error');
        return null;
      }

      // Combo streak counter
      setComboCount((prev) => {
        const nextCombo = prev + 1;
        sounds.playTap(nextCombo);
        return nextCombo;
      });

      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => setComboCount(0), 1200);

      triggerHaptic(turboActive ? 'heavy' : 'light');

      const coinsAwarded = earnPerTap;

      setState((prev) => ({
        ...prev,
        energy: Math.max(0, prev.energy - 1),
        coins: prev.coins + coinsAwarded,
        totalEarned: prev.totalEarned + coinsAwarded,
      }));

      return {
        amount: coinsAwarded,
        x: clientX,
        y: clientY,
        isCritical: turboActive || comboCount > 15,
      };
    },
    [state.energy, earnPerTap, turboActive, comboCount]
  );

  // Upgrade buying logic
  const getUpgradeCost = (cardId) => {
    const card = UPGRADE_CARDS.find((c) => c.id === cardId);
    if (!card) return 0;
    const currentLvl = state.upgrades[cardId] || 0;
    return Math.floor(card.baseCost * Math.pow(card.costMultiplier, currentLvl));
  };

  const buyUpgrade = useCallback(
    (cardId) => {
      const cost = getUpgradeCost(cardId);
      if (state.coins < cost) {
        triggerHaptic('warning');
        return false;
      }

      triggerHaptic('success');
      sounds.playUpgrade();

      setState((prev) => ({
        ...prev,
        coins: prev.coins - cost,
        upgrades: {
          ...prev.upgrades,
          [cardId]: (prev.upgrades[cardId] || 0) + 1,
        },
      }));
      return true;
    },
    [state.coins, state.upgrades]
  );

  // Claim offline earnings popup
  const claimOfflineEarnings = useCallback(() => {
    if (!offlineEarnings) return;
    const earned = offlineEarnings.coins;
    sounds.playClaim();
    triggerHaptic('success');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setState((prev) => ({
      ...prev,
      coins: prev.coins + earned,
      totalEarned: prev.totalEarned + earned,
    }));
    setOfflineEarnings(null);
  }, [offlineEarnings]);

  // Daily Streak Claim
  const claimDailyReward = useCallback(() => {
    const todayStr = new Date().toDateString();
    if (state.lastStreakClaim === todayStr) {
      triggerHaptic('warning');
      return false;
    }

    const currentReward = DAILY_STREAK_REWARDS[state.streakDay - 1] || DAILY_STREAK_REWARDS[0];
    sounds.playClaim();
    triggerHaptic('success');

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });

    setState((prev) => {
      const nextDay = prev.streakDay >= 7 ? 1 : prev.streakDay + 1;
      return {
        ...prev,
        coins: prev.coins + currentReward.coins,
        totalEarned: prev.totalEarned + currentReward.coins,
        streakDay: nextDay,
        lastStreakClaim: todayStr,
      };
    });
    return true;
  }, [state.streakDay, state.lastStreakClaim]);

  // Complete Quest / Earn Task
  const completeTask = useCallback(
    (taskId) => {
      if (state.completedTasks.includes(taskId)) return false;
      const task = EARN_TASKS.find((t) => t.id === taskId);
      if (!task) return false;

      sounds.playClaim();
      triggerHaptic('success');
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });

      setState((prev) => ({
        ...prev,
        coins: prev.coins + task.reward,
        totalEarned: prev.totalEarned + task.reward,
        completedTasks: [...prev.completedTasks, taskId],
      }));
      return true;
    },
    [state.completedTasks]
  );

  // Refill full energy booster (free 3/day)
  const useFullEnergyRefill = useCallback(() => {
    if (state.freeRefillsRemaining <= 0) {
      triggerHaptic('warning');
      return false;
    }

    sounds.playBooster();
    triggerHaptic('success');

    setState((prev) => ({
      ...prev,
      energy: prev.maxEnergy,
      freeRefillsRemaining: prev.freeRefillsRemaining - 1,
    }));
    return true;
  }, [state.freeRefillsRemaining, state.maxEnergy]);

  // Activate Turbo 5x Booster
  const activateTurbo = useCallback(() => {
    if (turboActive) return;
    sounds.playBooster();
    triggerHaptic('heavy');
    setTurboActive(true);
  }, [turboActive]);

  // Connect / Disconnect mock TON Wallet
  const toggleWalletConnection = useCallback(() => {
    sounds.playUpgrade();
    triggerHaptic('success');
    setState((prev) => {
      const isConnected = Boolean(prev.walletAddress);
      if (!isConnected) {
        confetti({ particleCount: 70, spread: 60 });
        return {
          ...prev,
          walletAddress: 'UQDK3a8...91Fc4',
          coins: prev.coins + 15000,
          totalEarned: prev.totalEarned + 15000,
          completedTasks: prev.completedTasks.includes('task_connect_wallet')
            ? prev.completedTasks
            : [...prev.completedTasks, 'task_connect_wallet'],
        };
      } else {
        return { ...prev, walletAddress: null };
      }
    });
  }, []);

  // Sound toggle
  const toggleSound = useCallback(() => {
    const newState = sounds.toggleSound();
    setState((prev) => ({ ...prev, soundMuted: !newState }));
    triggerHaptic('selection');
  }, []);

  return {
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
  };
}
