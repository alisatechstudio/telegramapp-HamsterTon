# telegramapp-HamsterTon

A Web3 Tap-to-Earn Telegram Mini App built with **React 19**, **Vite**, and **Modern CSS**.

---

## 🌟 Features

- **Tap-to-Earn Mechanics**: 3D tilt, physics spring easing, floating coin numbers, and multi-touch support.
- **Audio & Haptics Engine**: Zero-latency synthesized Web Audio sound effects and Telegram native haptics (`impactOccurred`, `notificationOccurred`).
- **Passive Profit & Upgrades**: 4 upgrade categories (Mining Hardware, Exchange & Bots, Viral PR, Special Ops) and real-time offline earnings calculation.
- **Quests & Streaks**: 7-day daily check-in rewards calendar, community bounties, and Telegram referral sharing.
- **TON Web3 Wallet**: Mock TON connect/disconnect interface, airdrop eligibility checklist, and TGE countdown.
- **Desktop Simulator**: Embedded Telegram frame simulator for easy desktop testing with toggle to full view.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build
```

---

## 📱 Launch on Telegram via @BotFather

1. Expose your local port via HTTPS (e.g. using Cloudflare Tunnel or ngrok):
   ```bash
   npx cloudflared tunnel --url http://localhost:5173
   ```
2. Message [@BotFather](https://t.me/BotFather) on Telegram.
3. Run `/newapp`, select your bot, provide the title `Hamster TON Empire`, and paste your HTTPS tunnel URL.
4. Launch your mini app via the link provided by BotFather!
