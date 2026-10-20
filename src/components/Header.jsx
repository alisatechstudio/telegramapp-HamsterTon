import { useState } from 'react';
import { Volume2, VolumeX, Share2, CheckCircle2, Smartphone, Monitor } from 'lucide-react';
import { shareTelegramReferral, triggerHaptic } from '../utils/telegram';

export function Header({ user, soundMuted, toggleSound, isFrameMode, toggleFrameMode }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    triggerHaptic('medium');
    shareTelegramReferral();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="tg-header" id="telegram-app-header">
      <div className="tg-bot-identity">
        <img
          src="/mascot_hamster.jpg"
          alt="Hamster CEO"
          className="tg-bot-avatar"
        />
        <div className="tg-bot-details">
          <div className="tg-bot-name">
            Hamster TON CEO
            <CheckCircle2 className="tg-verified-badge" />
          </div>
          <div className="tg-bot-sub">
            {user?.firstName ? `${user.firstName} (${user.username})` : '@HamsterTonBot'}
          </div>
        </div>
      </div>

      <div className="tg-actions">
        {/* Toggle Sound */}
        <button
          className="tg-icon-btn"
          onClick={toggleSound}
          title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
          id="btn-toggle-sound"
        >
          {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Share Referral */}
        <button
          className="tg-icon-btn"
          onClick={handleShare}
          title="Share Referral Link"
          id="btn-share-referral"
        >
          <Share2 size={16} />
        </button>

        {/* Desktop View Simulator Toggle */}
        <button
          className="tg-icon-btn"
          onClick={toggleFrameMode}
          title={isFrameMode ? 'Switch to Full Browser View' : 'Switch to Telegram Mobile Frame'}
          id="btn-toggle-frame"
        >
          {isFrameMode ? <Monitor size={16} /> : <Smartphone size={16} />}
        </button>
      </div>
    </header>
  );
}
