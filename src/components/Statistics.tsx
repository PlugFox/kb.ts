import type { Component } from 'solid-js';
import { For } from 'solid-js';
import type { KeyStatistics } from '../types/keyboard';
import { formatKey } from '../utils/keyboard';
import styles from './Statistics.module.css';

interface StatisticsProps {
  statistics: () => KeyStatistics;
  typingSpeed: () => 'slow' | 'medium' | 'fast' | 'very-fast';
  onReset: () => void;
}

const Statistics: Component<StatisticsProps> = (props) => {
  const getSpeedLabel = (speed: string) => {
    const labels = {
      'slow': 'Медленно',
      'medium': 'Средне',
      'fast': 'Быстро',
      'very-fast': 'Спринт'
    };
    return labels[speed as keyof typeof labels] || speed;
  };

  const getSpeedEmoji = (speed: string) => {
    const emojis = {
      'slow': '🐌',
      'medium': '🚶',
      'fast': '🏃',
      'very-fast': '🚀'
    };
    return emojis[speed as keyof typeof emojis] || '⌨️';
  };

  const formatSessionTime = () => {
    const stats = props.statistics();
    const sessionTime = (Date.now() - stats.sessionStartTime) / 1000;
    const minutes = Math.floor(sessionTime / 60);
    const seconds = Math.floor(sessionTime % 60);

    if (minutes > 0) {
      return `${minutes}м ${seconds}с`;
    }
    return `${seconds}с`;
  };

  return (
    <section class={styles.statistics}>
      <div class={styles.statsHeader}>
        <h2 class={styles.sectionTitle}>Статистика</h2>
        <button
          class={styles.resetButton}
          onClick={props.onReset}
          title="Сбросить статистику"
        >
          🔄
        </button>
      </div>

      <div class={styles.statsGrid}>
        {/* WPM */}
        <div class={styles.statCard}>
          <div class={styles.statIcon}>⌨️</div>
          <div class={styles.statContent}>
            <div class={styles.statValue}>{props.statistics().wpm}</div>
            <div class={styles.statLabel}>WPM</div>
          </div>
        </div>

        {/* Скорость печати */}
        <div class={styles.statCard}>
          <div class={styles.statIcon}>{getSpeedEmoji(props.typingSpeed())}</div>
          <div class={styles.statContent}>
            <div class={styles.statValue}>{getSpeedLabel(props.typingSpeed())}</div>
            <div class={styles.statLabel}>Скорость</div>
          </div>
        </div>

        {/* Общее количество нажатий */}
        <div class={styles.statCard}>
          <div class={styles.statIcon}>🔢</div>
          <div class={styles.statContent}>
            <div class={styles.statValue}>{props.statistics().totalKeyPresses}</div>
            <div class={styles.statLabel}>Всего нажатий</div>
          </div>
        </div>

        {/* Время сессии */}
        <div class={styles.statCard}>
          <div class={styles.statIcon}>⏰</div>
          <div class={styles.statContent}>
            <div class={styles.statValue}>{formatSessionTime()}</div>
            <div class={styles.statLabel}>Время сессии</div>
          </div>
        </div>
      </div>

      {/* Самые популярные клавиши */}
      {props.statistics().mostUsedKeys.length > 0 && (
        <div class={styles.popularKeys}>
          <h3 class={styles.popularKeysTitle}>Популярные клавиши</h3>
          <div class={styles.keysList}>
            <For each={props.statistics().mostUsedKeys.slice(0, 6)}>
              {(keyData, index) => (
                <div class={styles.popularKey}>
                  <div class={styles.keyRank}>#{index() + 1}</div>
                  <div class={styles.keyName}>{formatKey(keyData.key)}</div>
                  <div class={styles.keyCount}>{keyData.count}</div>
                </div>
              )}
            </For>
          </div>
        </div>
      )}
    </section>
  );
};

export default Statistics;