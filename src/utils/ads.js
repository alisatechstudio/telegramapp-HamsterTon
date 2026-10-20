// Monetag / Ad SDK Integration (Zone: 12077484)

/**
 * Initialize automatic background In-App Interstitial ads
 * - Shows 2 ads within 0.1 hours (6 minutes)
 * - 30 seconds interval between ads
 * - 5 seconds delay before the first ad
 * - everyPage: false preserves session across tab navigation
 */
export const initInAppAds = () => {
  if (typeof window !== 'undefined') {
    // Wait for the SDK script to attach show_12077484 to window
    const checkAndInit = () => {
      if (typeof window.show_12077484 === 'function') {
        window.show_12077484({
          type: 'inApp',
          inAppSettings: {
            frequency: 2,
            capping: 0.1,
            interval: 30,
            timeout: 5,
            everyPage: false,
          },
        });
      } else {
        setTimeout(checkAndInit, 1000);
      }
    };
    checkAndInit();
  }
};

/**
 * Rewarded Interstitial Ad
 * Called on user action (e.g. claim coins, refill energy)
 */
export const showRewardedInterstitial = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && typeof window.show_12077484 === 'function') {
      window.show_12077484()
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.warn('Rewarded interstitial error or skipped:', e);
          resolve(false);
        });
    } else {
      console.log('Ad SDK show_12077484 not loaded, simulating view in development');
      setTimeout(() => resolve(true), 800);
    }
  });
};

/**
 * Rewarded Popup Ad ('pop' format)
 */
export const showRewardedPopup = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && typeof window.show_12077484 === 'function') {
      window.show_12077484('pop')
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.warn('Rewarded popup error or skipped:', e);
          resolve(false);
        });
    } else {
      console.log('Ad SDK show_12077484 not loaded, simulating popup view in development');
      setTimeout(() => resolve(true), 800);
    }
  });
};

// Default export for backward compatibility
export const showRewardedAd = showRewardedInterstitial;
