export interface PressedKey {
  key: string;
  code: string;
  timestamp: number;
  id: number;
  modifiers: KeyModifiers;
  keyType: KeyType;
  duration?: number;
  vkCode?: number; // Virtual Key Code (VK)
  location?: number; // Key location
}

export interface KeyModifiers {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}



export interface KeyStatistics {
  totalKeyPresses: number;
  wpm: number;
  mostUsedKeys: Array<{ key: string; count: number }>;
  sessionStartTime: number;
  averageKeyInterval: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  hapticEnabled: boolean;
  historySize: number;
  showKeyCode: boolean;
  showVkCode: boolean;
  colorCoding: boolean;
  showStatistics: boolean;
  keyClickSound: string;
}

export type KeyType =
  | 'letter'
  | 'number'
  | 'modifier'
  | 'function'
  | 'special'
  | 'arrow'
  | 'punctuation';