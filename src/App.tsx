import type { Component } from 'solid-js';
import { createEffect } from 'solid-js';

// Hooks
import { useKeyboard } from './hooks/useKeyboard';
import { useKeyboardStatistics } from './hooks/useKeyboardStatistics';
import { useSettings } from './hooks/useSettings';

// Components
import KeyDisplay from './components/KeyDisplay';
import KeyHistory from './components/KeyHistory';
import Settings from './components/Settings';
import Statistics from './components/Statistics';

import styles from './App.module.css';

const App: Component = () => {
  const { settings, currentTheme, updateSetting, resetSettings } = useSettings();
  const { statistics, updateStatistics, resetStatistics, getTypingSpeed } = useKeyboardStatistics();

  const {
    pressedKeys,
    keyHistory,
    clearHistory
  } = useKeyboard(settings, updateStatistics);

  // Применяем тему к document
  createEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme());
  });

  return (
    <div class={styles.app} data-theme={currentTheme()}>
      <Settings
        settings={settings}
        onUpdateSetting={updateSetting}
        onResetSettings={resetSettings}
      />

      <header class={styles.header}>
        <h1 class={styles.title}>Keyboard Display</h1>
        <p class={styles.subtitle}>Нажимайте клавиши на клавиатуре</p>
      </header>

      <main class={styles.main}>
        <KeyDisplay
          pressedKeys={pressedKeys}
          theme={currentTheme}
          showKeyCode={() => settings().showKeyCode}
          showVkCode={() => settings().showVkCode}
          colorCoding={() => settings().colorCoding}
        />

        <div class={styles.sidebar}>
          <KeyHistory
            keyHistory={keyHistory}
            showKeyCode={() => settings().showKeyCode}
            showVkCode={() => settings().showVkCode}
            onClear={clearHistory}
          />

          {settings().showStatistics && (
            <Statistics
              statistics={statistics}
              typingSpeed={getTypingSpeed}
              onReset={resetStatistics}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
