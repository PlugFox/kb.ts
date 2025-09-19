import { createEffect, createSignal } from 'solid-js';
import type { KeyStatistics, PressedKey } from '../types/keyboard';

export const useKeyboardStatistics = () => {
  const [statistics, setStatistics] = createSignal<KeyStatistics>({
    totalKeyPresses: 0,
    wpm: 0,
    mostUsedKeys: [],
    sessionStartTime: Date.now(),
    averageKeyInterval: 0
  });

  const [keyFrequency, setKeyFrequency] = createSignal<Map<string, number>>(new Map());
  const [lastKeyTime, setLastKeyTime] = createSignal<number>(0);
  const [keyIntervals, setKeyIntervals] = createSignal<number[]>([]);

  const updateStatistics = (key: PressedKey) => {
    const now = Date.now();

    // Обновляем частоту клавиш только для букв и цифр (для более точного WPM)
    if (key.keyType === 'letter' || key.keyType === 'number' || key.key === 'Space') {
      setKeyFrequency(prev => {
        const newMap = new Map(prev);
        // Для букв используем code + текущий key для различения раскладок
        // Для цифр и пробела используем key как обычно
        const keyId = key.keyType === 'letter' ? `${key.code}:${key.key}` : key.key;
        const currentCount = newMap.get(keyId) || 0;
        newMap.set(keyId, currentCount + 1);
        return newMap;
      });
    }

    // Вычисляем интервал между нажатиями
    if (lastKeyTime() > 0) {
      const interval = now - lastKeyTime();
      setKeyIntervals(prev => [...prev.slice(-49), interval]); // Сохраняем последние 50 интервалов
    }
    setLastKeyTime(now);

    setStatistics(prev => {
      const sessionTimeSeconds = (now - prev.sessionStartTime) / 1000;
      const sessionTimeMinutes = sessionTimeSeconds / 60;
      const newTotalPresses = prev.totalKeyPresses + 1;

      // Рассчитываем WPM только на основе печатных символов
      const printableKeys = Array.from(keyFrequency().values()).reduce((sum, count) => sum + count, 0);
      const newWPM = sessionTimeMinutes > 0 ? Math.round((printableKeys / 5) / sessionTimeMinutes) : 0;

      const intervals = keyIntervals();
      const avgInterval = intervals.length > 0
        ? intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
        : 0;

      return {
        ...prev,
        totalKeyPresses: newTotalPresses,
        wpm: Math.max(0, newWPM), // Убеждаемся что WPM не отрицательный
        averageKeyInterval: Math.round(avgInterval)
      };
    });
  };

  // Обновляем список самых используемых клавиш при изменении частоты
  createEffect(() => {
    const frequency = keyFrequency();
    const sortedKeys = Array.from(frequency.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([keyId, count]) => {
        // Извлекаем отображаемый символ из keyId
        const displayKey = keyId.includes(':') ? keyId.split(':')[1] : keyId;
        return { key: displayKey, count };
      });

    setStatistics(prev => ({ ...prev, mostUsedKeys: sortedKeys }));
  });

  const resetStatistics = () => {
    setStatistics({
      totalKeyPresses: 0,
      wpm: 0,
      mostUsedKeys: [],
      sessionStartTime: Date.now(),
      averageKeyInterval: 0
    });
    setKeyFrequency(new Map());
    setKeyIntervals([]);
    setLastKeyTime(0);
  };

  const getTypingSpeed = (): 'slow' | 'medium' | 'fast' | 'very-fast' => {
    const wpm = statistics().wpm;
    if (wpm < 20) return 'slow';
    if (wpm < 40) return 'medium';
    if (wpm < 60) return 'fast';
    return 'very-fast';
  };

  return {
    statistics,
    updateStatistics,
    resetStatistics,
    getTypingSpeed
  };
};