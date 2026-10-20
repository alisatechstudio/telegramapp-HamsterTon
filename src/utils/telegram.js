// Telegram WebApp SDK Bridge & Helpers

export const isTelegramWebApp = () => {
  return typeof window !== 'undefined' && Boolean(window.Telegram?.WebApp?.initData);
};

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

// Initialize Telegram WebApp viewport, theme, and settings
export const initTelegramApp = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      
      // Request full height and disable accidental closing gestures
      if (tg.enableClosingConfirmation) {
        tg.enableClosingConfirmation();
      }
      
      // Set header and background theme colors to match game
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#0d0f18');
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor('#07090e');
      }
    } catch (e) {
      console.warn('Telegram WebApp init warning:', e);
    }
  }
};

// Trigger native Telegram haptics with web vibration fallback
export const triggerHaptic = (style = 'medium') => {
  const tg = getTelegramWebApp();
  
  if (tg?.HapticFeedback) {
    try {
      if (style === 'success' || style === 'warning' || style === 'error') {
        tg.HapticFeedback.notificationOccurred(style);
      } else if (style === 'selection') {
        tg.HapticFeedback.selectionChanged();
      } else {
        tg.HapticFeedback.impactOccurred(style); // 'light', 'medium', 'heavy', 'rigid', 'soft'
      }
      return;
    } catch {
      // Fallback below
    }
  }

  // Web Vibration API fallback
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      if (style === 'light' || style === 'selection') navigator.vibrate(12);
      else if (style === 'heavy' || style === 'error') navigator.vibrate([25, 40, 25]);
      else if (style === 'success') navigator.vibrate([15, 20, 30]);
      else navigator.vibrate(18); // medium
    } catch {
      // Ignore vibration error
    }
  }
};

// Get user profile from Telegram initData or provide authentic demo user
export const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  const unsafeUser = tg?.initDataUnsafe?.user;

  if (unsafeUser && unsafeUser.first_name) {
    return {
      id: unsafeUser.id,
      firstName: unsafeUser.first_name,
      lastName: unsafeUser.last_name || '',
      username: unsafeUser.username ? `@${unsafeUser.username}` : '@hamster_ceo',
      photoUrl: unsafeUser.photo_url || null,
      isPremium: Boolean(unsafeUser.is_premium),
      languageCode: unsafeUser.language_code || 'en',
      isRealTelegramUser: true,
    };
  }

  // Fallback demo user for browser testing
  return {
    id: 884729104,
    firstName: 'Alex',
    lastName: 'Vance',
    username: '@ton_crypto_ceo',
    photoUrl: null,
    isPremium: true,
    languageCode: 'en',
    isRealTelegramUser: false,
  };
};

// Open Telegram Link / Share Referral
export const shareTelegramReferral = (refCode = 'ref_hamster_ton') => {
  const tg = getTelegramWebApp();
  const shareText = encodeURIComponent(
    `🚀 Tap, Mine, and Earn with me on Hamster TON Empire!\nClaim your 50,000 coin CEO Starter Pack now:`
  );
  const botUrl = `https://t.me/HamsterTonEmpireBot/app?startapp=${refCode}`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(botUrl)}&text=${shareText}`;

  if (tg?.openTelegramLink) {
    tg.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }
};
