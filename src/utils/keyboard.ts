import type { KeyModifiers, KeyType } from '../types/keyboard';

export const getKeyType = (code: string, key: string): KeyType => {
  // Модификаторы
  if (['ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'ShiftLeft', 'ShiftRight', 'MetaLeft', 'MetaRight'].includes(code)) {
    return 'modifier';
  }

  // Функциональные клавиши
  if (code.startsWith('F') && /F\d+/.test(code)) {
    return 'function';
  }

  // Стрелки
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
    return 'arrow';
  }

  // Буквы (включая кириллицу и другие алфавиты)
  if (/^\p{L}$/u.test(key)) {
    return 'letter';
  }

  // Цифры
  if (/^[0-9]$/.test(key)) {
    return 'number';
  }

  // Пунктуация
  if (/^[.,;:!?'"\-_+={}[\]()/<>*&^%$#@~`|\\]$/.test(key)) {
    return 'punctuation';
  }

  // Все остальное
  return 'special';
};

export const formatKey = (key: string): string => {
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
    'Escape': '⎋',
    'Home': '⇱',
    'End': '⇲',
    'PageUp': '⇞',
    'PageDown': '⇟',
    'Insert': 'Ins',
    'PrintScreen': 'PrtSc',
    'ScrollLock': 'ScrLk',
    'Pause': '⏸',
    'NumLock': 'NumLk',
    'ContextMenu': '☰'
  };

  return keyMap[key] || key;
};

export const getKeyModifiers = (event: KeyboardEvent): KeyModifiers => ({
  ctrl: event.ctrlKey,
  alt: event.altKey,
  shift: event.shiftKey,
  meta: event.metaKey
});



export const getKeyTypeColor = (keyType: KeyType, theme: 'light' | 'dark'): string => {
  const colors = {
    light: {
      letter: '#3b82f6',      // blue
      number: '#10b981',      // emerald
      modifier: '#f59e0b',    // amber
      function: '#8b5cf6',    // violet
      special: '#ef4444',     // red
      arrow: '#06b6d4',       // cyan
      punctuation: '#84cc16'  // lime
    },
    dark: {
      letter: '#60a5fa',      // blue-400
      number: '#34d399',      // emerald-400
      modifier: '#fbbf24',    // amber-400
      function: '#a78bfa',    // violet-400
      special: '#f87171',     // red-400
      arrow: '#22d3ee',       // cyan-400
      punctuation: '#a3e635'  // lime-400
    }
  };

  return colors[theme][keyType];
};

export const calculateWPM = (keyPresses: number, timeInMinutes: number): number => {
  if (timeInMinutes === 0) return 0;
  // Средняя длина слова в английском языке - 5 символов
  const words = keyPresses / 5;
  return Math.round(words / timeInMinutes);
};

// Глобальный AudioContext для избежания создания множественных контекстов
let globalAudioContext: AudioContext | null = null;
let audioContextInitialized = false;

const initializeAudioContext = (): void => {
  if (audioContextInitialized || globalAudioContext) return;

  try {
    globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextInitialized = true;

    // Добавляем обработчик ошибок
    globalAudioContext.addEventListener('statechange', () => {
      if (globalAudioContext?.state === 'interrupted') {
        console.warn('AudioContext был прерван');
      }
    });

  } catch (error) {
    console.warn('AudioContext не поддерживается или недоступен:', error);
    audioContextInitialized = true; // Помечаем как инициализированный, чтобы не пытаться снова
  }
};

const getAudioContext = (): AudioContext | null => {
  if (!audioContextInitialized) {
    initializeAudioContext();
  }

  if (!globalAudioContext) return null;

  // Возобновляем контекст если он приостановлен
  if (globalAudioContext.state === 'suspended') {
    globalAudioContext.resume().catch(error => {
      console.warn('Не удалось возобновить AudioContext:', error);
    });
  }

  return globalAudioContext.state === 'running' ? globalAudioContext : null;
};

// Инициализируем AudioContext при первом взаимодействии пользователя
if (typeof window !== 'undefined') {
  const initOnInteraction = () => {
    initializeAudioContext();
    document.removeEventListener('click', initOnInteraction);
    document.removeEventListener('keydown', initOnInteraction);
    document.removeEventListener('touchstart', initOnInteraction);
  };

  document.addEventListener('click', initOnInteraction);
  document.addEventListener('keydown', initOnInteraction);
  document.addEventListener('touchstart', initOnInteraction);
}

export const playKeySound = (keyType: KeyType, soundEnabled: boolean): void => {
  if (!soundEnabled) return;

  const audioContext = getAudioContext();
  if (!audioContext) return;

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Разные частоты для разных типов клавиш
    const frequencies: Record<KeyType, number> = {
      letter: 440,
      number: 523,
      modifier: 349,
      function: 659,
      special: 293,
      arrow: 392,
      punctuation: 466
    };

    oscillator.frequency.setValueAtTime(frequencies[keyType] || 440, audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.08);
  } catch (error) {
    console.warn('Ошибка при воспроизведении звука:', error);
  }
};

export const triggerHapticFeedback = (keyType: KeyType, hapticEnabled: boolean): void => {
  if (!hapticEnabled || !navigator.vibrate) return;

  try {
    // Разные паттерны вибрации для разных типов клавиш
    const patterns: Record<KeyType, number | number[]> = {
      letter: 10,
      number: 15,
      modifier: [20, 10, 20],
      function: 25,
      special: [10, 5, 10, 5, 10],
      arrow: 12,
      punctuation: 8
    };

    navigator.vibrate(patterns[keyType] || 10);
  } catch (error) {
    console.warn('Ошибка при запуске вибрации:', error);
  }
};