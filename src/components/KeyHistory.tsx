import type { Component } from 'solid-js';
import { For } from 'solid-js';
import type { PressedKey } from '../types/keyboard';
import { formatKey } from '../utils/keyboard';
import styles from './KeyHistory.module.css';

interface KeyHistoryProps {
  keyHistory: () => PressedKey[];
  showKeyCode: () => boolean;
  showVkCode: () => boolean;
  onClear: () => void;
}

const KeyHistory: Component<KeyHistoryProps> = (props) => {
  return (
    <section class={styles.keyHistory}>
      <div class={styles.historyHeader}>
        <h2 class={styles.sectionTitle}>История нажатий</h2>
        <button
          class={styles.clearButton}
          onClick={props.onClear}
          disabled={props.keyHistory().length === 0}
        >
          Очистить
        </button>
      </div>
      <div class={styles.historyContainer}>
        {props.keyHistory().length === 0 ? (
          <div class={styles.emptyState}>История пуста</div>
        ) : (
          <For each={props.keyHistory()}>
            {(keyData) => (
              <div class={styles.historyItem} data-key-type={keyData.keyType}>
                <span class={styles.historyKeyLabel}>
                  {formatKey(keyData.key)}
                </span>
                <div class={styles.historyKeyInfo}>
                  {props.showKeyCode() && (
                    <span class={styles.historyKeyCode}>{keyData.code}</span>
                  )}
                  {props.showVkCode() && (
                    <span class={styles.vkCode}>VK:{keyData.vkCode || 'N/A'}</span>
                  )}
                  <span class={styles.historyKeyType}>{keyData.keyType}</span>
                  {keyData.duration && (
                    <span class={styles.historyKeyDuration}>
                      {keyData.duration}ms
                    </span>
                  )}
                </div>
              </div>
            )}
          </For>
        )}
      </div>
    </section>
  );
};

export default KeyHistory;