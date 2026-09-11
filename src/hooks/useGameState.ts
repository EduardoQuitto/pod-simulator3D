import { useReducer, useCallback } from 'react';
import type { GameState, Resources, GameStage } from '../types/game';
import { TIME_SLOTS } from '../data/school';
import { determineEnding } from '../data/endings';

const INITIAL_RESOURCES: Resources = {
  money: 30,
  dependency: 0,
  health: 100,
  energy: 100,
  anxiety: 10,
};

const initialState: GameState = {
  screen: 'menu',
  resources: { ...INITIAL_RESOURCES },
  timeSlotIndex: 0,
  uses: 0,
  buys: 0,
  stoppedAt: null,
  startTime: 0,
  stage: 1,
  positiveDecisions: 0,
  currentObjective: 'Vá para a Sala 1',
  completedObjectives: [],
  nearbyNPC: null,
  nearbyObject: null,
  inDialogue: false,
  dialogueNPC: null,
  dialogueLines: [],
  dialogueStep: 0,
  showEvent: false,
  currentEvent: null,
  actionFeedback: null,
  interactPrompt: null,
};

type GameAction =
  | { type: 'SET_SCREEN'; screen: GameState['screen'] }
  | { type: 'START_GAME' }
  | { type: 'SET_NEARBY_NPC'; npc: string | null }
  | { type: 'SET_NEARBY_OBJECT'; obj: string | null; prompt: string | null }
  | { type: 'START_DIALOGUE'; npc: string; lines: GameState['dialogueLines'] }
  | { type: 'RESPONSE_CHOSEN'; effect: Partial<Resources>; feedback: string }
  | { type: 'ADVANCE_DIALOGUE' }
  | { type: 'END_DIALOGUE' }
  | { type: 'SHOW_EVENT'; event: GameState['currentEvent'] }
  | { type: 'EVENT_CHOSEN'; effect: Partial<Resources>; feedback: string }
  | { type: 'DISMISS_EVENT' }
  | { type: 'TAKE_ACTION'; actionType: string; effect: Partial<Resources>; feedback: string }
  | { type: 'NEXT_TURN' }
  | { type: 'COMPLETE_OBJECTIVE'; id: string }
  | { type: 'SET_OBJECTIVE'; text: string }
  | { type: 'CLEAR_FEEDBACK' }
  | { type: 'RESET' };

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function getStage(dep: number): GameStage {
  if (dep < 15) return 1;
  if (dep < 30) return 2;
  if (dep < 50) return 3;
  if (dep < 70) return 4;
  return 5;
}

function applyEffect(res: Resources, effect: Partial<Resources>): Resources {
  const r = { ...res };
  for (const [k, v] of Object.entries(effect)) {
    if (v !== undefined && k in r) {
      (r as Record<string, number>)[k] = clamp(
        (r as Record<string, number>)[k] + v,
        0,
        k === 'money' ? 999 : 100
      );
    }
  }
  r.anxiety = clamp(r.anxiety + res.dependency * 0.03, 0, 100);
  return r;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'START_GAME':
      return {
        ...initialState,
        screen: 'game',
        resources: { ...INITIAL_RESOURCES },
        timeSlotIndex: 0,
        startTime: Date.now(),
        currentObjective: 'Vá para a Sala 1',
      };

    case 'SET_NEARBY_NPC':
      return { ...state, nearbyNPC: action.npc };

    case 'SET_NEARBY_OBJECT':
      return { ...state, nearbyObject: action.obj, interactPrompt: action.prompt };

    case 'START_DIALOGUE':
      return {
        ...state,
        inDialogue: true,
        dialogueNPC: action.npc,
        dialogueLines: action.lines,
        dialogueStep: 0,
      };

    case 'RESPONSE_CHOSEN': {
      const newRes = applyEffect(state.resources, action.effect);
      const newStage = getStage(newRes.dependency);
      const isPositive = Object.entries(action.effect).some(
        ([k, v]) => (k === 'health' || k === 'energy') && (v ?? 0) > 0
      ) || (action.effect.dependency ?? 0) < 0;
      return {
        ...state,
        resources: newRes,
        stage: newStage,
        actionFeedback: action.feedback,
        positiveDecisions: state.positiveDecisions + (isPositive ? 1 : 0),
        dialogueStep: state.dialogueStep + 1,
      };
    }

    case 'ADVANCE_DIALOGUE':
      return { ...state, dialogueStep: state.dialogueStep + 1 };

    case 'END_DIALOGUE':
      return {
        ...state,
        inDialogue: false,
        dialogueNPC: null,
        dialogueLines: [],
        dialogueStep: 0,
      };

    case 'SHOW_EVENT':
      return { ...state, showEvent: true, currentEvent: action.event };

    case 'EVENT_CHOSEN': {
      const newRes = applyEffect(state.resources, action.effect);
      const newStage = getStage(newRes.dependency);
      const isPositive = (action.effect.dependency ?? 0) < 0 || (action.effect.health ?? 0) > 0;
      return {
        ...state,
        resources: newRes,
        stage: newStage,
        showEvent: false,
        currentEvent: null,
        actionFeedback: action.feedback,
        positiveDecisions: state.positiveDecisions + (isPositive ? 1 : 0),
      };
    }

    case 'DISMISS_EVENT':
      return { ...state, showEvent: false, currentEvent: null };

    case 'TAKE_ACTION': {
      const newRes = applyEffect(state.resources, action.effect);
      const newStage = getStage(newRes.dependency);
      const newUses = state.uses + (action.actionType === 'use' ? 1 : 0);
      const newBuys = state.buys + (action.actionType === 'buyNew' ? 1 : 0);
      const newStoppedAt = action.actionType === 'stop' && !state.stoppedAt
        ? TIME_SLOTS[state.timeSlotIndex]
        : state.stoppedAt;
      const isPositive = ['notUse', 'talk', 'stop'].includes(action.actionType);
      return {
        ...state,
        resources: newRes,
        stage: newStage,
        uses: newUses,
        buys: newBuys,
        stoppedAt: newStoppedAt,
        actionFeedback: action.feedback,
        positiveDecisions: state.positiveDecisions + (isPositive ? 1 : 0),
      };
    }

    case 'NEXT_TURN': {
      const next = state.timeSlotIndex + 1;
      if (next >= TIME_SLOTS.length) return { ...state, screen: 'end' };
      return { ...state, timeSlotIndex: next };
    }

    case 'COMPLETE_OBJECTIVE':
      return {
        ...state,
        completedObjectives: [...state.completedObjectives, action.id],
      };

    case 'SET_OBJECTIVE':
      return { ...state, currentObjective: action.text };

    case 'CLEAR_FEEDBACK':
      return { ...state, actionFeedback: null };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setScreen = useCallback((s: GameState['screen']) => dispatch({ type: 'SET_SCREEN', screen: s }), []);
  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const setNearbyNpc = useCallback((n: string | null) => dispatch({ type: 'SET_NEARBY_NPC', npc: n }), []);
  const setNearbyObject = useCallback((o: string | null, p: string | null) => dispatch({ type: 'SET_NEARBY_OBJECT', obj: o, prompt: p }), []);
  const startDialogue = useCallback((npc: string, lines: GameState['dialogueLines']) => dispatch({ type: 'START_DIALOGUE', npc, lines }), []);
  const responseChosen = useCallback((effect: Partial<Resources>, feedback: string) => dispatch({ type: 'RESPONSE_CHOSEN', effect, feedback }), []);
  const advanceDialogue = useCallback(() => dispatch({ type: 'ADVANCE_DIALOGUE' }), []);
  const endDialogue = useCallback(() => dispatch({ type: 'END_DIALOGUE' }), []);
  const showEvent = useCallback((event: GameState['currentEvent']) => dispatch({ type: 'SHOW_EVENT', event }), []);
  const eventChosen = useCallback((effect: Partial<Resources>, feedback: string) => dispatch({ type: 'EVENT_CHOSEN', effect, feedback }), []);
  const dismissEvent = useCallback(() => dispatch({ type: 'DISMISS_EVENT' }), []);
  const takeAction = useCallback((t: string, e: Partial<Resources>, f: string) => dispatch({ type: 'TAKE_ACTION', actionType: t, effect: e, feedback: f }), []);
  const nextTurn = useCallback(() => dispatch({ type: 'NEXT_TURN' }), []);
  const completeObjective = useCallback((id: string) => dispatch({ type: 'COMPLETE_OBJECTIVE', id }), []);
  const setObjective = useCallback((text: string) => dispatch({ type: 'SET_OBJECTIVE', text }), []);
  const clearFeedback = useCallback(() => dispatch({ type: 'CLEAR_FEEDBACK' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const currentTime = TIME_SLOTS[state.timeSlotIndex];
  const ending = state.screen === 'end'
    ? determineEnding(state.resources.dependency, state.resources.health, state.uses, state.stoppedAt, state.positiveDecisions)
    : null;
  const duration = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;

  return {
    state, currentTime, ending, duration,
    setScreen, startGame, setNearbyNpc, setNearbyObject,
    startDialogue, responseChosen, advanceDialogue, endDialogue,
    showEvent, eventChosen, dismissEvent,
    takeAction, nextTurn, completeObjective, setObjective,
    clearFeedback, reset,
  };
}

export type UseGameStateReturn = ReturnType<typeof useGameState>;
