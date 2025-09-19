import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import type { AppSettings } from '../types/keyboard';
import styles from './Settings.module.css';

interface SettingsProps {
  settings: () => AppSettings;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onResetSettings: () => void;
}

const Settings: Component<SettingsProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleSettings = () => {
    setIsOpen(!isOpen());
  };

  return (
    <>
      <button
        class={styles.settingsButton}
        onClick={toggleSettings}
        title="Настройки"
      >
        ⚙️
      </button>

      {isOpen() && (
        <div class={styles.settingsOverlay} onClick={() => setIsOpen(false)}>
          <div class={styles.settingsPanel} onClick={(e) => e.stopPropagation()}>
            <div class={styles.settingsHeader}>
              <h2 class={styles.settingsTitle}>Настройки</h2>
              <button
                class={styles.closeButton}
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            <div class={styles.settingsContent}>
              {/* Тема */}
              <div class={styles.settingGroup}>
                <label class={styles.settingLabel}>Тема:</label>
                <select
                  class={styles.settingSelect}
                  value={props.settings().theme}
                  onChange={(e) => props.onUpdateSetting('theme', e.target.value as any)}
                >
                  <option value="auto">Авто</option>
                  <option value="light">Светлая</option>
                  <option value="dark">Темная</option>
                </select>
              </div>

              {/* Звук */}
              <div class={styles.settingGroup}>
                <label class={styles.settingCheckbox}>
                  <input
                    type="checkbox"
                    checked={props.settings().soundEnabled}
                    onChange={(e) => props.onUpdateSetting('soundEnabled', e.target.checked)}
                  />
                  <span class={styles.checkboxLabel}>Звуковые эффекты</span>
                </label>
              </div>

              {/* Вибрация */}
              <div class={styles.settingGroup}>
                <label class={styles.settingCheckbox}>
                  <input
                    type="checkbox"
                    checked={props.settings().hapticEnabled}
                    onChange={(e) => props.onUpdateSetting('hapticEnabled', e.target.checked)}
                  />
                  <span class={styles.checkboxLabel}>Тактильная обратная связь</span>
                </label>
              </div>

              {/* Размер истории */}
              <div class={styles.settingGroup}>
                <label class={styles.settingLabel}>
                  Размер истории: {props.settings().historySize}
                </label>
                <input
                  type="range"
                  class={styles.settingRange}
                  min="5"
                  max="50"
                  value={props.settings().historySize}
                  onChange={(e) => props.onUpdateSetting('historySize', parseInt(e.target.value))}
                />
              </div>

              {/* Показать код клавиш */}
              <div class={styles.settingGroup}>
                <label class={styles.settingCheckbox}>
                  <input
                    type="checkbox"
                    checked={props.settings().showKeyCode}
                    onChange={(e) => props.onUpdateSetting('showKeyCode', e.target.checked)}
                  />
                  <span class={styles.checkboxLabel}>Показывать код клавиш</span>
                </label>
              </div>

              {/* Показать VK код */}
              <div class={styles.settingGroup}>
                <label class={styles.settingCheckbox}>
                  <input
                    type="checkbox"
                    checked={props.settings().showVkCode}
                    onChange={(e) => props.onUpdateSetting('showVkCode', e.target.checked)}
                  />
                  <span class={styles.checkboxLabel}>Показывать VK код</span>
                </label>
              </div>

              {/* Цветовое кодирование */}
              <div class={styles.settingGroup}>
                <label class={styles.settingCheckbox}>
                  <input
                    type="checkbox"
                    checked={props.settings().colorCoding}
                    onChange={(e) => props.onUpdateSetting('colorCoding', e.target.checked)}
                  />
                  <span class={styles.checkboxLabel}>Цветовое кодирование клавиш</span>
                </label>
              </div>

              {/* Показать статистику */}
              <div class={styles.settingGroup}>
                <label class={styles.settingCheckbox}>
                  <input
                    type="checkbox"
                    checked={props.settings().showStatistics}
                    onChange={(e) => props.onUpdateSetting('showStatistics', e.target.checked)}
                  />
                  <span class={styles.checkboxLabel}>Показывать статистику</span>
                </label>
              </div>
            </div>

            <div class={styles.settingsFooter}>
              <button
                class={styles.resetButton}
                onClick={props.onResetSettings}
              >
                Сбросить настройки
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;