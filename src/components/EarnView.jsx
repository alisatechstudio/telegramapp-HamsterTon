import { Calendar, Check, Send, Share2, UserPlus, Wallet, PlayCircle } from 'lucide-react';
import { DAILY_STREAK_REWARDS, EARN_TASKS } from '../data/gameData';
import { shareTelegramReferral } from '../utils/telegram';
import { showRewardedAd } from '../utils/ads';

const TASK_ICONS = {
  Send,
  Twitter: Share2,
  Share2,
  UserPlus,
  Wallet,
  PlayCircle,
};

export function EarnView({ state, onClaimStreak, onCompleteTask, onConnectWallet }) {
  const todayStr = new Date().toDateString();
  const alreadyClaimedToday = state.lastStreakClaim === todayStr;

  const handleTaskAction = (task) => {
    if (state.completedTasks.includes(task.id)) return;

    if (task.isAd) {
      showRewardedAd().then((success) => {
        if (success) {
          onCompleteTask(task.id);
        }
      });
    } else if (task.isInvite) {
      shareTelegramReferral();
      setTimeout(() => onCompleteTask(task.id), 1200);
    } else if (task.isWallet) {
      onConnectWallet();
    } else {
      if (task.url) {
        window.open(task.url, '_blank', 'noopener,noreferrer');
      }
      setTimeout(() => onCompleteTask(task.id), 1000);
    }
  };

  const formatNumber = (num) => num.toLocaleString();

  return (
    <div className="earn-view-container" id="earn-view">
      {/* 7-Day Streak Rewards Box */}
      <div className="daily-streak-card">
        <div className="streak-card-top">
          <div className="streak-card-title">
            <Calendar size={18} color="#ffd700" /> Daily Check-in Streak
          </div>
          <span style={{ fontSize: 12, color: '#ffd700', fontWeight: 700 }}>
            Day {state.streakDay}/7
          </span>
        </div>

        <div className="streak-days-row">
          {DAILY_STREAK_REWARDS.map((reward) => {
            const isClaimed = reward.day < state.streakDay;
            const isCurrent = reward.day === state.streakDay;

            return (
              <div
                key={reward.day}
                className={`streak-day-cell ${isClaimed ? 'claimed' : ''} ${
                  isCurrent ? 'active' : ''
                }`}
              >
                <span className="streak-day-num">D{reward.day}</span>
                {isClaimed ? (
                  <Check size={14} color="#10b981" />
                ) : (
                  <span className="streak-day-reward">+{formatNumber(reward.coins)}</span>
                )}
              </div>
            );
          })}
        </div>

        <button
          className="claim-streak-btn"
          onClick={onClaimStreak}
          disabled={alreadyClaimedToday}
          id="btn-claim-streak"
        >
          {alreadyClaimedToday ? 'Already Claimed Today ✓' : `Claim Day ${state.streakDay} Reward 🎁`}
        </button>
      </div>

      {/* Community Quests & Tasks */}
      <div className="criteria-title" style={{ marginTop: 8, marginBottom: 10 }}>
        Special Tasks & Bounties
      </div>

      <div className="tasks-list">
        {EARN_TASKS.map((task) => {
          const isDone = state.completedTasks.includes(task.id);
          const IconComponent = TASK_ICONS[task.icon] || Send;

          return (
            <div key={task.id} className="task-item-card" id={`task-${task.id}`}>
              <div className="task-item-left">
                <div className="task-icon-box">
                  <IconComponent size={20} />
                </div>
                <div>
                  <div className="task-info-title">{task.title}</div>
                  <div className="task-reward-tag">+{formatNumber(task.reward)} Coins</div>
                </div>
              </div>

              <button
                className={`task-action-btn ${isDone ? 'done' : ''}`}
                onClick={() => handleTaskAction(task)}
                disabled={isDone}
                id={`btn-${task.id}`}
              >
                {isDone ? 'Completed ✓' : task.actionText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
