import type { Component } from 'solid-js';
import { createSignal, onCleanup, onMount } from 'solid-js';

import styles from './App.module.css';

interface PressedKey {
  key: string;
  code: string;
  timestamp: number;
  id: number;
}

const App: Component = () => {
  const [pressedKeys, setPressedKeys] = createSignal<Map<string, PressedKey>>(new Map());
  const [keyHistory, setKeyHistory] = createSignal<PressedKey[]>([]);
  let keyIdCounter = 0;

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();

    const key = event.key === ' ' ? 'Space' : event.key;
    const code = event.code;

    // Предотвращаем дублирование при зажатой клавише
    if (pressedKeys().has(code)) return;

    const keyData: PressedKey = {
      key,
      code,
      timestamp: Date.now(),
      id: ++keyIdCounter
    };

    setPressedKeys(prev => new Map(prev).set(code, keyData));
    setKeyHistory(prev => [...prev.slice(-9), keyData]); // Сохраняем последние 10 нажатий
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const code = event.code;
    setPressedKeys(prev => {
      const newMap = new Map(prev);
      newMap.delete(code);
      return newMap;
    });
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  });

  const formatKey = (key: string) => {
    const keyMap: Record<string, string> = {
      ' ': 'Space',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'Enter': '⏎',
      'Backspace': '⌫',
      'Delete': '⌦',
      'Tab': '⇥',
      'CapsLock': '⇪',
      'Shift': '⇧',
      'Control': 'Ctrl',
      'Alt': '⌥',
      'Meta': '⌘',
      'Escape': '⎋'
    };

    return keyMap[key] || key;
  };

  return (
    <div class={styles.app}>
      <header class={styles.header}>
        <h1 class={styles.title}>Keyboard Display</h1>
        <p class={styles.subtitle}>Нажимайте клавиши на клавиатуре</p>
      </header>

      <main class={styles.main}>
        <section class={styles.currentKeys}>
          <h2 class={styles.sectionTitle}>Активные клавиши</h2>
          <div class={styles.keysContainer}>
            {Array.from(pressedKeys()).length === 0 ? (
              <div class={styles.emptyState}>Нажмите любую клавишу</div>
            ) : (
              Array.from(pressedKeys()).map(([code, keyData]) => (
                <div class={styles.key}>
                  <span class={styles.keyLabel}>{formatKey(keyData.key)}</span>
                  <span class={styles.keyCode}>{code}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section class={styles.keyHistory}>
          <h2 class={styles.sectionTitle}>История нажатий</h2>
          <div class={styles.historyContainer}>
            {keyHistory().length === 0 ? (
              <div class={styles.emptyState}>История пуста</div>
            ) : (
              keyHistory().map((keyData) => (
                <div class={styles.historyItem}>
                  <span class={styles.historyKeyLabel}>{formatKey(keyData.key)}</span>
                  <span class={styles.historyKeyCode}>{keyData.code}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
