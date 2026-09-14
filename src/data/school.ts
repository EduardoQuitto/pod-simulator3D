import type { WallDef, FurnitureDef, NPCDef, InteractiveObjectDef } from '../types/game';

export const PLAYER_HEIGHT = 1.7;
export const PLAYER_RADIUS = 0.35;
export const INTERACTION_DISTANCE = 2.5;
export const SPRINT_MULTIPLIER = 1.8;

export const TIME_SLOTS = ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'] as const;

export const STAGE_NAMES: Record<number, string> = {
  1: 'Só uma brincadeira', 2: 'Só mais uma', 3: 'Preciso comprar outro', 4: 'Não consigo ignorar', 5: 'E agora?',
};

const W = '#e8e4df';
const W2 = '#ddd8d0';
const W3 = '#d4cfc5';

export const WALLS: WallDef[] = [
  // ═══════ CORREDOR PRINCIPAL (x:-2..2, z:-20..20) ═══════

  // === PAREDE LESTE do corredor (x:2) com gaps para portas ===
  // Porta Sala 1 em z=-13.5 → gap z:-14.25..-12.75
  { position: [2, 1.5, -17.125], size: [0.25, 3.2, 5.75], color: W },
  { position: [2, 1.5, -10], size: [0.25, 3.2, 5.5], color: W },
  // Porta Sala 2 em z=-6.5 → gap z:-7.25..-5.75
  { position: [2, 1.5, -2], size: [0.25, 3.2, 7.5], color: W },
  // Porta Sala 3 em z=2.5 → gap z:1.75..3.25
  { position: [2, 1.5, 7], size: [0.25, 3.2, 7.5], color: W },
  // Porta Sala 4 em z=11.5 → gap z:10.75..12.25
  { position: [2, 1.5, 14.75], size: [0.25, 3.2, 5], color: W },
  // Porta pátio em z=18 → gap z:17.25..18.75
  { position: [2, 1.5, 19.375], size: [0.25, 3.2, 1.25], color: W },

  // === PAREDE OESTE do corredor (x:-2) com gaps para portas ===
  // Porta banheiro em z=-3.5 → gap z:-4.25..-2.75
  { position: [-2, 1.5, -12.125], size: [0.25, 3.2, 15.75], color: W },
  // Porta academia em z=6.5 → gap z:5.75..7.25
  { position: [-2, 1.5, 1.5], size: [0.25, 3.2, 8.5], color: W },
  { position: [-2, 1.5, 13.625], size: [0.25, 3.2, 12.75], color: W },

  // === PAREDES SUL/NORTE (entrada/pátio) ===
  { position: [-1.5, 1.5, -20], size: [1, 3.2, 0.25], color: W },
  { position: [1.5, 1.5, -20], size: [1, 3.2, 0.25], color: W },
  { position: [-2.5, 1.5, -20], size: [1, 3.2, 0.25], color: W },
  { position: [2.5, 1.5, -20], size: [1, 3.2, 0.25], color: W },
  { position: [-1.5, 1.5, 20], size: [1, 3.2, 0.25], color: W },
  { position: [1.5, 1.5, 20], size: [1, 3.2, 0.25], color: W },

  // ═══════ SALA 1 (x:2..10, z:-15.5..-11) ═══════
  { position: [6, 1.5, -15.5], size: [8, 3.2, 0.25], color: W },
  { position: [10, 1.5, -13.25], size: [0.25, 3.2, 4.5], color: W },
  { position: [6, 1.5, -11], size: [8, 3.2, 0.25], color: W },

  // ═══════ SALA 2 (x:2..10, z:-9..-4) ═══════
  { position: [6, 1.5, -9], size: [8, 3.2, 0.25], color: W },
  { position: [10, 1.5, -6.5], size: [0.25, 3.2, 5], color: W },
  { position: [6, 1.5, -4], size: [8, 3.2, 0.25], color: W },

  // ═══════ SALA 3 (x:2..10, z:0..5) ═══════
  { position: [6, 1.5, 0], size: [8, 3.2, 0.25], color: W },
  { position: [10, 1.5, 2.5], size: [0.25, 3.2, 5], color: W },
  { position: [6, 1.5, 5], size: [8, 3.2, 0.25], color: W },

  // ═══════ SALA 4 - LABORATÓRIO (x:2..10, z:9..14) ═══════
  { position: [6, 1.5, 9], size: [8, 3.2, 0.25], color: W },
  { position: [10, 1.5, 11.5], size: [0.25, 3.2, 5], color: W },
  { position: [6, 1.5, 14], size: [8, 3.2, 0.25], color: W },

  // ═══════ BANHEIRO (x:-8..-2, z:-4.5..-1.5) ═══════
  { position: [-5, 1.5, -4.5], size: [6, 3.2, 0.25], color: W2 },
  { position: [-5, 1.5, -1.5], size: [6, 3.2, 0.25], color: W2 },
  { position: [-8, 1.5, -3], size: [0.25, 3.2, 3], color: W2 },

  // ═══════ ACADEMIA (x:-14..-8, z:5..14) ═══════
  { position: [-11, 1.5, 5], size: [6, 3.2, 0.25], color: W3 },
  { position: [-11, 1.5, 14], size: [6, 3.2, 0.25], color: W3 },
  { position: [-14, 1.5, 9.5], size: [0.25, 3.2, 9], color: W3 },
  { position: [-8, 1.5, 9.5], size: [0.25, 3.2, 5], color: W3 },

  // ═══════ BIBLIOTECA (x:3..10, z:22..30) ═══════
  { position: [6.5, 1.5, 22], size: [7, 3.2, 0.25], color: W },
  { position: [6.5, 1.5, 30], size: [7, 3.2, 0.25], color: W },
  // Parede oeste da biblioteca com gap para porta (z=26)
  { position: [3, 1.5, 23.625], size: [0.25, 3.2, 3.25], color: W },
  { position: [3, 1.5, 28.375], size: [0.25, 3.2, 3.25], color: W },
  { position: [10, 1.5, 26], size: [0.25, 3.2, 8], color: W },

  // ═══════ PÁTIO expandido (x:-7..7, z:20..32) ═══════
  { position: [-7, 1.5, 26], size: [0.25, 3.2, 12], color: W3 },
  { position: [7, 1.5, 26], size: [0.25, 3.2, 12], color: W3 },
  { position: [0, 1.5, 32], size: [14, 3.2, 0.25], color: W3 },

  // Colunas decorativas no corredor
  { position: [-1.8, 1.5, -8], size: [0.3, 3.2, 0.3], color: '#d0ccc5' },
  { position: [1.8, 1.5, -8], size: [0.3, 3.2, 0.3], color: '#d0ccc5' },
  { position: [-1.8, 1.5, 0], size: [0.3, 3.2, 0.3], color: '#d0ccc5' },
  { position: [1.8, 1.5, 0], size: [0.3, 3.2, 0.3], color: '#d0ccc5' },
  { position: [-1.8, 1.5, 8], size: [0.3, 3.2, 0.3], color: '#d0ccc5' },
  { position: [1.8, 1.5, 8], size: [0.3, 3.2, 0.3], color: '#d0ccc5' },
  { position: [-1.8, 1.5, 16], size: [0.3, 3.2, 0.3], color: '#d0ccc5' },
  { position: [1.8, 1.5, 16], size: [0.3, 3.2, 0.3], color: '#d0ccc5' },
];

export const FURNITURE: FurnitureDef[] = [
  // ═══════ SALA 1 ═══════
  { type: 'blackboard', position: [6, 1.8, -15.3], size: [4, 1.2, 0.1], color: '#2d5a27' },
  { type: 'teacherDesk', position: [6, 0.4, -14], size: [2, 0.8, 1], color: '#5a3a20' },
  { type: 'desk', position: [4, 0.4, -12.5], size: [1.2, 0.8, 0.8], color: '#8B6914' },
  { type: 'chair', position: [4, 0.3, -11.8] },
  { type: 'desk', position: [6, 0.4, -12.5], size: [1.2, 0.8, 0.8], color: '#8B6914' },
  { type: 'chair', position: [6, 0.3, -11.8] },
  { type: 'desk', position: [8, 0.4, -12.5], size: [1.2, 0.8, 0.8], color: '#8B6914' },
  { type: 'chair', position: [8, 0.3, -11.8] },
  { type: 'desk', position: [4, 0.4, -11.5], size: [1.2, 0.8, 0.8], color: '#8B6914' },
  { type: 'chair', position: [4, 0.3, -11] },
  { type: 'desk', position: [6, 0.4, -11.5], size: [1.2, 0.8, 0.8], color: '#8B6914' },
  { type: 'chair', position: [6, 0.3, -11] },
  { type: 'desk', position: [8, 0.4, -11.5], size: [1.2, 0.8, 0.8], color: '#8B6914' },
  { type: 'chair', position: [8, 0.3, -11] },

  // ═══════ SALA 2 ═══════
  { type: 'blackboard', position: [6, 1.8, -8.8], size: [4, 1.2, 0.1], color: '#2d5a27' },
  { type: 'teacherDesk', position: [6, 0.4, -7.5], size: [2, 0.8, 1], color: '#5a3a20' },
  { type: 'desk', position: [4, 0.4, -6], size: [1.2, 0.8, 0.8], color: '#8B6914' },
  { type: 'chair', position: [4, 0.3, -5.3] },
  { type: 'desk', position: [6, 0.4, -6], size: [1.2, 0.8, 0.8], color: '#8B6914' },
  { type: 'chair', position: [6, 0.3, -5.3] },
  { type: 'desk', position: [8, 0.4, -6], size: [1.2, 0.8, 0.8], color: '#8B6914' },
  { type: 'chair', position: [8, 0.3, -5.3] },

  // ═══════ SALA 3 ═══════
  { type: 'blackboard', position: [6, 1.8, 0.2], size: [4, 1.2, 0.1], color: '#2d5a27' },
  { type: 'teacherDesk', position: [6, 0.4, 1.5], size: [2, 0.8, 1], color: '#5a3a20' },
  { type: 'desk', position: [4, 0.4, 3], size: [1.2, 0.8, 0.8], color: '#8B6914' },
  { type: 'chair', position: [4, 0.3, 3.7] },
  { type: 'desk', position: [6, 0.4, 3], size: [1.2, 0.8, 0.8], color: '#8B6914' },
  { type: 'chair', position: [6, 0.3, 3.7] },
  { type: 'desk', position: [8, 0.4, 3], size: [1.2, 0.8, 0.8], color: '#8B6914' },
  { type: 'chair', position: [8, 0.3, 3.7] },

  // ═══════ SALA 4 - LABORATÓRIO ═══════
  { type: 'blackboard', position: [6, 1.8, 9.2], size: [4, 1.2, 0.1], color: '#2d5a27' },
  { type: 'teacherDesk', position: [6, 0.4, 10.5], size: [2, 0.8, 1], color: '#5a3a20' },
  { type: 'desk', position: [4, 0.45, 12], size: [1.5, 0.9, 0.8], color: '#9a9a9a' },
  { type: 'desk', position: [7, 0.45, 12], size: [1.5, 0.9, 0.8], color: '#9a9a9a' },
  { type: 'desk', position: [4, 0.45, 13], size: [1.5, 0.9, 0.8], color: '#9a9a9a' },
  { type: 'desk', position: [7, 0.45, 13], size: [1.5, 0.9, 0.8], color: '#9a9a9a' },

  // ═══════ CORREDOR - Armários ═══════
  { type: 'locker', position: [-1.7, 0.8, -16], color: '#607080' },
  { type: 'locker', position: [-1.7, 0.8, -15], color: '#607080' },
  { type: 'locker', position: [-1.7, 0.8, -14], color: '#607080' },
  { type: 'locker', position: [-1.7, 0.8, -10], color: '#5a6a7a' },
  { type: 'locker', position: [-1.7, 0.8, -9], color: '#5a6a7a' },
  { type: 'locker', position: [-1.7, 0.8, 3], color: '#607080' },
  { type: 'locker', position: [-1.7, 0.8, 4], color: '#607080' },
  { type: 'locker', position: [-1.7, 0.8, 12], color: '#5a6a7a' },
  { type: 'locker', position: [-1.7, 0.8, 13], color: '#5a6a7a' },
  { type: 'locker', position: [-1.7, 0.8, 14], color: '#5a6a7a' },

  // ═══════ CORREDOR - Máquina de vendas ═══════
  { type: 'vending', position: [1.7, 0.9, -10] },

  // ═══════ BANHEIRO ═══════
  { type: 'stall', position: [-6, 0.8, -4] },
  { type: 'stall', position: [-4.5, 0.8, -4] },
  { type: 'stall', position: [-3.5, 0.8, -4] },
  { type: 'sink', position: [-3.5, 0.6, -1.8] },
  { type: 'sink', position: [-5, 0.6, -1.8] },

  // ═══════ ACADEMIA ═══════
  { type: 'bench', position: [-12, 0.25, 6], size: [3, 0.5, 0.6] },
  { type: 'bench', position: [-12, 0.25, 13], size: [3, 0.5, 0.6] },
  { type: 'bench', position: [-9.5, 0.25, 9.5], size: [0.6, 0.5, 3] },

  // ═══════ BIBLIOTECA ═══════
  { type: 'desk', position: [5, 0.4, 24], size: [1.5, 0.8, 0.8], color: '#6b4226' },
  { type: 'desk', position: [8, 0.4, 24], size: [1.5, 0.8, 0.8], color: '#6b4226' },
  { type: 'desk', position: [5, 0.4, 28], size: [1.5, 0.8, 0.8], color: '#6b4226' },
  { type: 'desk', position: [8, 0.4, 28], size: [1.5, 0.8, 0.8], color: '#6b4226' },
  { type: 'chair', position: [5, 0.3, 24.8] },
  { type: 'chair', position: [8, 0.3, 24.8] },
  { type: 'chair', position: [5, 0.3, 28.8] },
  { type: 'chair', position: [8, 0.3, 28.8] },
  { type: 'locker', position: [3.3, 0.8, 24], color: '#5a3a20' },
  { type: 'locker', position: [3.3, 0.8, 25], color: '#5a3a20' },
  { type: 'locker', position: [3.3, 0.8, 26], color: '#5a3a20' },
  { type: 'locker', position: [9.7, 0.8, 24], color: '#5a3a20' },
  { type: 'locker', position: [9.7, 0.8, 25], color: '#5a3a20' },
  { type: 'locker', position: [9.7, 0.8, 26], color: '#5a3a20' },

  // ═══════ PÁTIO ═══════
  { type: 'bench', position: [-4, 0.25, 24], size: [2, 0.5, 0.6] },
  { type: 'bench', position: [4, 0.25, 24], size: [2, 0.5, 0.6] },
  { type: 'bench', position: [0, 0.25, 28], size: [2, 0.5, 0.6] },
  { type: 'bench', position: [-4, 0.25, 30], size: [2, 0.5, 0.6] },
  { type: 'bench', position: [4, 0.25, 30], size: [2, 0.5, 0.6] },
  { type: 'tree', position: [-5, 0, 26] },
  { type: 'tree', position: [5, 0, 27] },
  { type: 'tree', position: [-3, 0, 30] },
  { type: 'tree', position: [3, 0, 29] },
  { type: 'trashCan', position: [0, 0.4, 22] },

  // ═══════ CORREDOR - Lixeiras ═══════
  { type: 'trashCan', position: [1.7, 0.4, 15] },
  { type: 'trashCan', position: [-1.7, 0.4, -18] },
];

export const NPCS: NPCDef[] = [
  { id: 'lucas', name: 'Lucas', position: [6, 0, 26], bodyColor: '#4a7fd9', color: '#f5d0a9' },
  { id: 'professor', name: 'Prof. Marcos', position: [6, 0, -13], bodyColor: '#e0ddd5', color: '#e8c9a0' },
  { id: 'marina', name: 'Marina', position: [-3, 0, 27], bodyColor: '#d94a7f', color: '#f0d0b0' },
  { id: 'pedro', name: 'Pedro', position: [-1, 0, 10], bodyColor: '#4ad94a', color: '#e5c9a0' },
  { id: 'ana', name: 'Ana', position: [5, 0, 12], bodyColor: '#d9a44a', color: '#f0d0a0' },
];

export const INTERACTIVE_OBJECTS: InteractiveObjectDef[] = [
  { id: 'pod_bathroom', name: 'Pod escondido', type: 'pod', position: [-7, 0.05, -2.5], size: [0.15, 0.3, 0.1], color: '#8a8a9a' },
  { id: 'backpack', name: 'Sua mochila', type: 'backpack', position: [4, 0.55, -12], size: [0.4, 0.5, 0.3], color: '#3a5a8a' },
  { id: 'vending', name: 'Máquina de vendas', type: 'vending', position: [1.7, 0.9, -10], size: [0.6, 1.8, 0.8], color: '#3a4a5a' },
  { id: 'phone', name: 'Celular', type: 'phone', position: [6, 0.82, -13.8], size: [0.15, 0.02, 0.08], color: '#1a1a2a' },
  { id: 'pod_courtyard', name: 'Pod no chão', type: 'pod', position: [1, 0.05, 28], size: [0.15, 0.3, 0.1], color: '#7a7a8a' },
  { id: 'book', name: 'Livro na estante', type: 'backpack', position: [5, 0.85, 24], size: [0.2, 0.3, 0.15], color: '#8a3a3a' },
];

export const OBJECTIVES: Record<number, { text: string; location?: [number, number, number]; npc?: string }> = {
  0: { text: 'Vá para a Sala 1', location: [6, 0, -13] },
  1: { text: 'Converse com Lucas', npc: 'lucas' },
  2: { text: 'Vá ao pátio', location: [0, 0, 26] },
  3: { text: 'Descanse no banco', location: [0, 0.25, 28] },
  4: { text: 'Volte para a Sala 1', location: [6, 0, -13] },
  5: { text: 'Encontre Marina', npc: 'marina' },
  6: { text: 'Decida o que fazer com o resto do dia' },
  7: { text: 'Volte para a entrada', location: [0, 0, -18] },
};
