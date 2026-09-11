export type Screen = 'menu' | 'game' | 'end' | 'howItWorks' | 'credits' | 'stats';
export type GameStage = 1 | 2 | 3 | 4 | 5;
export type ActionType = 'use' | 'notUse' | 'buyNew' | 'save' | 'talk' | 'stop';

export interface Resources {
  money: number;
  dependency: number;
  health: number;
  energy: number;
  anxiety: number;
}

export interface WallDef {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}

export interface FurnitureDef {
  type: 'desk' | 'chair' | 'blackboard' | 'locker' | 'bench' | 'vending' | 'door' | 'window' | 'teacherDesk' | 'stall' | 'sink' | 'tree' | 'trashCan';
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number, number];
  color?: string;
}

export interface NPCDef {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  bodyColor: string;
}

export interface InteractiveObjectDef {
  id: string;
  name: string;
  type: 'pod' | 'backpack' | 'phone' | 'vending' | 'bench' | 'door' | 'locker' | 'trashCan';
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

export interface GameEvent {
  id: string;
  icon: string;
  title: string;
  description: string;
  effect?: Partial<Resources>;
  choices?: Array<{
    text: string;
    effect: Partial<Resources>;
    feedback: string;
  }>;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  responses?: Array<{
    text: string;
    effect: Partial<Resources>;
    feedback: string;
  }>;
}

export interface Objective {
  id: string;
  text: string;
  timeSlot: number;
  location?: string;
  npc?: string;
  completed: boolean;
}

export interface Ending {
  id: string;
  name: string;
  message: string;
  classification: 'green' | 'yellow' | 'red';
}

export interface GameState {
  screen: Screen;
  resources: Resources;
  timeSlotIndex: number;
  uses: number;
  buys: number;
  stoppedAt: string | null;
  startTime: number;
  stage: GameStage;
  positiveDecisions: number;
  currentObjective: string;
  completedObjectives: string[];
  nearbyNPC: string | null;
  nearbyObject: string | null;
  inDialogue: boolean;
  dialogueNPC: string | null;
  dialogueLines: DialogueLine[];
  dialogueStep: number;
  showEvent: boolean;
  currentEvent: GameEvent | null;
  actionFeedback: string | null;
  interactPrompt: string | null;
}

export interface Stats {
  totalGames: number;
  bestScore: number;
  lowestDependency: number;
  highestMoney: number;
  bestEnding: string;
}
