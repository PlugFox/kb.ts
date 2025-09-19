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
    // Разрешаем только критически важные системные комбинации
    const allowedSystemCombinations = [
      // Копирование/вставка/выделение (только если фокус на input/textarea)
      (event.ctrlKey || event.metaKey) && ['KeyC', 'KeyV', 'KeyX', 'KeyA'].includes(event.code) &&
        (event.target as HTMLElement)?.tagName?.match(/INPUT|TEXTAREA/),

      // Отладка в браузере
      event.key === 'F12',

      // Обновление страницы (Ctrl+R, F5) - только если зажат Ctrl
      (event.ctrlKey || event.metaKey) && event.code === 'KeyR',

      // Закрытие вкладки (Ctrl+W) - только если зажат Ctrl
      (event.ctrlKey || event.metaKey) && event.code === 'KeyW',

      // Новая вкладка (Ctrl+T) - только если зажат Ctrl
      (event.ctrlKey || event.metaKey) && event.code === 'KeyT',

      // Переключение вкладок (Ctrl+Tab, Ctrl+Shift+Tab)
      (event.ctrlKey || event.metaKey) && event.code === 'Tab',

      // Адресная строка (Ctrl+L)
      (event.ctrlKey || event.metaKey) && event.code === 'KeyL',

      // Поиск на странице (Ctrl+F)
      (event.ctrlKey || event.metaKey) && event.code === 'KeyF'
    ];

    // Блокируем все события кроме разрешенных системных
    if (!allowedSystemCombinations.some(condition => condition)) {
      event.preventDefault();
      event.stopPropagation();
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
    // Такая же логика блокировки как в keyDown
    const allowedSystemCombinations = [
      (event.ctrlKey || event.metaKey) && ['KeyC', 'KeyV', 'KeyX', 'KeyA'].includes(event.code) &&
        (event.target as HTMLElement)?.tagName?.match(/INPUT|TEXTAREA/),
      event.key === 'F12',
      (event.ctrlKey || event.metaKey) && ['KeyR', 'KeyW', 'KeyT', 'KeyL', 'KeyF'].includes(event.code),
      (event.ctrlKey || event.metaKey) && event.code === 'Tab'
    ];

    if (!allowedSystemCombinations.some(condition => condition)) {
      event.preventDefault();
      event.stopPropagation();
    }

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
    // Используем capture: true для перехвата событий раньше других обработчиков
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('keyup', handleKeyUp, { capture: true });

    // Дополнительно блокируем события на window для гарантии
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown, { capture: true });
    document.removeEventListener('keyup', handleKeyUp, { capture: true });
    window.removeEventListener('keydown', handleKeyDown, { capture: true });
    window.removeEventListener('keyup', handleKeyUp, { capture: true });
    keyPressStartTimes.clear();
  });

  return {
    pressedKeys,
    keyHistory,
    clearHistory
  };
};