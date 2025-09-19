/**
 * Маппинг event.code к VK кодам (Virtual Key Codes)
 * Основано на стандартных VK кодах Windows
 */
export const VK_CODES: Record<string, number> = {
  // Буквы
  'KeyA': 0x41, 'KeyB': 0x42, 'KeyC': 0x43, 'KeyD': 0x44, 'KeyE': 0x45,
  'KeyF': 0x46, 'KeyG': 0x47, 'KeyH': 0x48, 'KeyI': 0x49, 'KeyJ': 0x4A,
  'KeyK': 0x4B, 'KeyL': 0x4C, 'KeyM': 0x4D, 'KeyN': 0x4E, 'KeyO': 0x4F,
  'KeyP': 0x50, 'KeyQ': 0x51, 'KeyR': 0x52, 'KeyS': 0x53, 'KeyT': 0x54,
  'KeyU': 0x55, 'KeyV': 0x56, 'KeyW': 0x57, 'KeyX': 0x58, 'KeyY': 0x59,
  'KeyZ': 0x5A,

  // Цифры
  'Digit0': 0x30, 'Digit1': 0x31, 'Digit2': 0x32, 'Digit3': 0x33, 'Digit4': 0x34,
  'Digit5': 0x35, 'Digit6': 0x36, 'Digit7': 0x37, 'Digit8': 0x38, 'Digit9': 0x39,

  // Функциональные клавиши
  'F1': 0x70, 'F2': 0x71, 'F3': 0x72, 'F4': 0x73, 'F5': 0x74, 'F6': 0x75,
  'F7': 0x76, 'F8': 0x77, 'F9': 0x78, 'F10': 0x79, 'F11': 0x7A, 'F12': 0x7B,
  'F13': 0x7C, 'F14': 0x7D, 'F15': 0x7E, 'F16': 0x7F, 'F17': 0x80, 'F18': 0x81,
  'F19': 0x82, 'F20': 0x83, 'F21': 0x84, 'F22': 0x85, 'F23': 0x86, 'F24': 0x87,

  // Цифровая клавиатура
  'Numpad0': 0x60, 'Numpad1': 0x61, 'Numpad2': 0x62, 'Numpad3': 0x63, 'Numpad4': 0x64,
  'Numpad5': 0x65, 'Numpad6': 0x66, 'Numpad7': 0x67, 'Numpad8': 0x68, 'Numpad9': 0x69,
  'NumpadMultiply': 0x6A, 'NumpadAdd': 0x6B, 'NumpadSubtract': 0x6D,
  'NumpadDecimal': 0x6E, 'NumpadDivide': 0x6F, 'NumpadEnter': 0x0D,

  // Стрелки
  'ArrowLeft': 0x25, 'ArrowUp': 0x26, 'ArrowRight': 0x27, 'ArrowDown': 0x28,

  // Модификаторы
  'ShiftLeft': 0xA0, 'ShiftRight': 0xA1,
  'ControlLeft': 0xA2, 'ControlRight': 0xA3,
  'AltLeft': 0xA4, 'AltRight': 0xA5,
  'MetaLeft': 0x5B, 'MetaRight': 0x5C,

  // Специальные клавиши
  'Space': 0x20,
  'Enter': 0x0D,
  'Tab': 0x09,
  'Escape': 0x1B,
  'Backspace': 0x08,
  'Delete': 0x2E,
  'Insert': 0x2D,
  'Home': 0x24,
  'End': 0x23,
  'PageUp': 0x21,
  'PageDown': 0x22,
  'CapsLock': 0x14,
  'ScrollLock': 0x91,
  'NumLock': 0x90,
  'PrintScreen': 0x2C,
  'Pause': 0x13,

  // Пунктуация и символы
  'Semicolon': 0xBA,        // ;:
  'Equal': 0xBB,           // =+
  'Comma': 0xBC,           // ,<
  'Minus': 0xBD,           // -_
  'Period': 0xBE,          // .>
  'Slash': 0xBF,           // /?
  'Backquote': 0xC0,       // `~
  'BracketLeft': 0xDB,     // [{
  'Backslash': 0xDC,       // \|
  'BracketRight': 0xDD,    // ]}
  'Quote': 0xDE,           // '"

  // Дополнительные клавиши
  'ContextMenu': 0x5D,
  'Help': 0x2F,
  'Select': 0x29,
  'Execute': 0x2B,
  'Snapshot': 0x2C,
  'Clear': 0x0C,

  // Мультимедиа клавиши (примерные значения)
  'AudioVolumeUp': 0xAF,
  'AudioVolumeDown': 0xAE,
  'AudioVolumeMute': 0xAD,
  'MediaPlayPause': 0xB3,
  'MediaStop': 0xB2,
  'MediaTrackPrevious': 0xB1,
  'MediaTrackNext': 0xB0,
};

/**
 * Получает VK код для заданного event.code
 * @param code - код клавиши из KeyboardEvent.code
 * @returns VK код или undefined если не найден
 */
export function getVkCode(code: string): number | undefined {
  return VK_CODES[code];
}

/**
 * Получает VK код с fallback на deprecated методы
 * @param event - событие клавиатуры
 * @returns VK код
 */
export function getVkCodeSafe(event: KeyboardEvent): number {
  // Сначала пытаемся получить из нашей таблицы
  const vkCode = getVkCode(event.code);
  if (vkCode !== undefined) {
    return vkCode;
  }

  // Fallback на deprecated методы только если нет в таблице
  return event.keyCode || event.which || 0;
}