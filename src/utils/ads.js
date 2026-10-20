// Monetag / Ad SDK Integration Helper
// Zone: 12077484

export const showRewardedAd = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && typeof window.show_12077484 === 'function') {
      window.show_12077484()
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          console.warn('Ad error or dismissed:', error);
          // Resolve anyway or reject depending on policy
          resolve(false);
        });
    } else {
      console.log('Ad SDK show_12077484 function not available, simulating successful view in dev');
      // In local dev without adblocker or when offline, simulate ad completion after 1s
      setTimeout(() => {
        resolve(true);
      }, 1000);
    }
  });
};
