import { createSignal, onCleanup, onMount } from 'solid-js';
import type { PressedKey } from '../types/keyboard';
import {
    getKeyType,
    playKeySound,
    triggerHapticFeedback
} from '../utils/keyboard';
import { getVkCodeSafe } from '../utils/vkCodes';

export const useKeyboard = (
  settings: () => { soundEnabled: boolean; hapticEnabled: boolean; historySize: number },
  onKeyPress?: (key: PressedKey) => void
) => {
  const [pressedKeys, setPressedKeys] = createSignal<Map<string, PressedKey>>(new Map());
  const [keyHistory, setKeyHistory] = createSignal<PressedKey[]>([]);

  let keyIdCounter = 0;
  const keyPressStartTimes = new Map<string, number>();

  const handleKeyDown = (event: KeyboardEvent) => {
    // Не блокируем все события, только некоторые системные
    const shouldPreventDefault = [
      'F5', 'F11', 'F12', // Обновление страницы, полноэкранный режим
    ].includes(event.code) ||
    (event.ctrlKey && ['KeyR', 'KeyW', 'KeyT'].includes(event.code)); // Ctrl+R, Ctrl+W, Ctrl+T

    if (shouldPreventDefault) {
      event.preventDefault();
    }

    const key = event.key === ' ' ? 'Space' : event.key;
    const code = event.code;
    const keyType = getKeyType(code, key);

    // Предотвращаем дублирование при зажатой клавише
    if (pressedKeys().has(code)) return;

    // Запоминаем время начала нажатия
    keyPressStartTimes.set(code, Date.now());

    const keyData: PressedKey = {
      key,
      code,
      timestamp: Date.now(),
      id: ++keyIdCounter,
      modifiers: {
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
        meta: event.metaKey
      },
      keyType,
      vkCode: getVkCodeSafe(event), // VK код из таблицы маппинга
      location: event.location // Позиция клавиши (для клавиш с несколькими вариантами, например левый/правый Shift)
    };

    setPressedKeys(prev => new Map(prev).set(code, keyData));

    const currentSettings = settings();
    setKeyHistory(prev => [...prev.slice(-(currentSettings.historySize - 1)), keyData]);

    // Уведомляем о нажатии клавиши для статистики
    if (onKeyPress) {
      onKeyPress(keyData);
    }

    // Воспроизводим звук и вибрацию
    playKeySound(keyType, currentSettings.soundEnabled);
    triggerHapticFeedback(keyType, currentSettings.hapticEnabled);

    return keyData;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const code = event.code;

    setPressedKeys(prev => {
      const newMap = new Map(prev);
      const keyData = newMap.get(code);

      if (keyData && keyPressStartTimes.has(code)) {
        // Вычисляем длительность нажатия
        const startTime = keyPressStartTimes.get(code)!;
        const duration = Date.now() - startTime;
        keyData.duration = duration;
        keyPressStartTimes.delete(code);
      }

      newMap.delete(code);
      return newMap;
    });
  };

  const clearHistory = () => {
    setKeyHistory([]);
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    keyPressStartTimes.clear();
  });

  return {
    pressedKeys,
    keyHistory,
    clearHistory
  };
};