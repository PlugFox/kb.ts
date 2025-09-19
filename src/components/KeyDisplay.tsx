import type { Component } from 'solid-js';
import { For } from 'solid-js';
import type { PressedKey } from '../types/keyboard';
import { formatKey, getKeyTypeColor } from '../utils/keyboard';
import styles from './KeyDisplay.module.css';

interface KeyDisplayProps {
  pressedKeys: () => Map<string, PressedKey>;
  theme: () => 'light' | 'dark';
  showKeyCode: () => boolean;
  showVkCode: () => boolean;
  colorCoding: () => boolean;
}

const KeyDisplay: Component<KeyDisplayProps> = (props) => {
  return (
    <section class={styles.currentKeys}>
      <h2 class={styles.sectionTitle}>Активные клавиши</h2>
      <div class={styles.keysContainer}>
        {Array.from(props.pressedKeys()).length === 0 ? (
          <div class={styles.emptyState}>Нажмите любую клавишу</div>
        ) : (
          <For each={Array.from(props.pressedKeys())}>
            {([code, keyData]) => (
              <div
                class={styles.key}
                style={{
                  '--key-color': props.colorCoding()
                    ? getKeyTypeColor(keyData.keyType, props.theme())
                    : undefined
                }}
                data-key-type={keyData.keyType}
              >
                <span class={styles.keyLabel}>
                  {formatKey(keyData.key)}
                </span>
                {props.showKeyCode() && (
                  <span class={styles.keyCode}>{code}</span>
                )}
                {props.showVkCode() && (
                  <span class={styles.vkCode}>VK: {keyData.vkCode || 'N/A'}</span>
                )}
                <span class={styles.keyType}>{keyData.keyType}</span>
                {keyData.duration && (
                  <span class={styles.keyDuration}>
                    {keyData.duration}ms
                  </span>
                )}
              </div>
            )}
          </For>
        )}
      </div>
    </section>
  );
};

export default KeyDisplay;