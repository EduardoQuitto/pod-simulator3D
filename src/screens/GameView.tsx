import { Suspense, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, SSAO, Bloom, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { Scene3D } from '../three/Scene3D';
import { HUD } from '../components/HUD';
import { DialogueBox } from '../components/DialogueBox';
import { EventModal } from '../components/EventModal';
import { useGame } from '../hooks/useGameContext';
import { OBJECTIVES } from '../data/school';
import { NPC_DIALOGUES } from '../data/dialogues';
import { getRandomEvent } from '../data/events';

export function GameView() {
  const gs = useGame();
  const { state } = gs;
  const eventTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasInDialogue = useRef(false);

  const currentObjective = OBJECTIVES[state.timeSlotIndex];
  const objectiveLoc = currentObjective?.location;
  const objectiveNpc = currentObjective?.npc;

  useEffect(() => {
    if (wasInDialogue.current && !state.inDialogue && !state.showEvent) {
      const timer = setTimeout(() => {
        const canvas = document.querySelector('canvas');
        if (canvas && state.screen === 'game') {
          canvas.requestPointerLock();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    wasInDialogue.current = state.inDialogue || state.showEvent;
  }, [state.inDialogue, state.showEvent, state.screen]);

  const handleNearNPC = useCallback((npc: string | null) => gs.setNearbyNpc(npc), [gs.setNearbyNpc]);
  const handleNearObject = useCallback((obj: string | null, prompt: string | null) => gs.setNearbyObject(obj, prompt), [gs.setNearbyObject]);

  const handleInteract = useCallback(() => {
    if (state.inDialogue || state.showEvent) return;

    if (state.nearbyNPC) {
      const lines = NPC_DIALOGUES[state.nearbyNPC];
      if (lines) {
        gs.startDialogue(state.nearbyNPC, lines);
        if (currentObjective?.npc === state.nearbyNPC) {
          gs.completeObjective(`obj-${state.timeSlotIndex}`);
        }
      }
      return;
    }

    if (state.nearbyObject) {
      if (state.nearbyObject === 'pod_bathroom' || state.nearbyObject === 'pod_courtyard') {
        const event = getRandomEvent(state.resources.dependency);
        if (event) {
          gs.showEvent(event);
        } else {
          gs.takeAction('use', { dependency: 8, health: -4, anxiety: -8 }, 'Você usou. A ansiedade baixou... por agora.');
        }
      } else if (state.nearbyObject === 'vending') {
        if (state.resources.money >= 15) {
          gs.takeAction('buyNew', { money: -15, dependency: 5 }, 'Novo pod comprado. O ciclo continua...');
        } else {
          gs.takeAction('nothing', {}, 'Dinheiro insuficiente.');
        }
      } else if (state.nearbyObject === 'phone') {
        gs.takeAction('notUse', { anxiety: 5, health: 2 }, 'Você pegou o celular. Sem novidades.');
      } else if (state.nearbyObject === 'backpack') {
        gs.takeAction('save', { energy: 3 }, 'Você organizou sua mochila.');
      }
    }
  }, [state, gs, currentObjective]);

  const handleObjectiveReached = useCallback(() => {
    gs.completeObjective(`obj-${state.timeSlotIndex}`);
    gs.nextTurn();
  }, [gs, state.timeSlotIndex]);

  const handleDialogueResponse = useCallback((effect: Record<string, number>, feedback: string) => {
    gs.responseChosen(effect, feedback);
  }, [gs.responseChosen]);

  const handleDialogueClose = useCallback(() => {
    gs.endDialogue();
    setTimeout(() => gs.clearFeedback(), 2500);
  }, [gs.endDialogue, gs.clearFeedback]);

  const handleEventChoose = useCallback((effect: Partial<Record<string, number>>, feedback: string) => {
    gs.eventChosen(effect, feedback);
    setTimeout(() => gs.clearFeedback(), 2500);
  }, [gs.eventChosen, gs.clearFeedback]);

  const handleEventDismiss = useCallback(() => {
    gs.dismissEvent();
  }, [gs.dismissEvent]);

  useEffect(() => {
    if (state.screen !== 'game' || state.inDialogue || state.showEvent) return;
    if (eventTimerRef.current) clearTimeout(eventTimerRef.current);

    const chance = 0.15 + state.resources.dependency * 0.005;
    const delay = 10000 + Math.random() * 15000;

    eventTimerRef.current = setTimeout(() => {
      if (state.screen === 'game' && !state.inDialogue && !state.showEvent) {
        if (Math.random() < chance) {
          const event = getRandomEvent(state.resources.dependency);
          if (event) gs.showEvent(event);
        }
      }
    }, delay);

    return () => { if (eventTimerRef.current) clearTimeout(eventTimerRef.current); };
  }, [state.timeSlotIndex, state.screen, state.inDialogue, state.showEvent, state.resources.dependency]);

  return (
    <div className="game-3d">
      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 120, position: [0, 1.7, -18] }}
        gl={{
          antialias: true,
          toneMapping: 4,
          toneMappingExposure: 1.0,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#0d0d1a']} />
        <fog attach="fog" args={['#0d0d1a', 25, 65]} />
        <Suspense fallback={null}>
          <Scene3D
            timeSlotIndex={state.timeSlotIndex}
            enabled={state.screen === 'game' && !state.inDialogue && !state.showEvent}
            onNearNPC={handleNearNPC}
            onNearObject={handleNearObject}
            onInteract={handleInteract}
            objectiveLocation={objectiveLoc}
            objectiveNpc={objectiveNpc}
            onObjectiveReached={handleObjectiveReached}
          />
        </Suspense>
        <EffectComposer multisampling={4}>
          <SSAO
            radius={0.5}
            intensity={30}
            luminanceInfluence={0.5}
            color="#0a0a18"
          />
          <Bloom
            intensity={0.2}
            luminanceThreshold={0.7}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette offset={0.3} darkness={0.6} />
        </EffectComposer>
      </Canvas>

      <HUD
        resources={state.resources}
        stage={state.stage}
        timeSlotIndex={state.timeSlotIndex}
        objective={state.currentObjective}
        interactPrompt={state.interactPrompt}
        actionFeedback={state.actionFeedback}
        stoppedAt={state.stoppedAt}
        onInteract={handleInteract}
      />

      {state.inDialogue && state.dialogueNPC && (
        <DialogueBox
          lines={state.dialogueLines}
          step={state.dialogueStep}
          onResponse={handleDialogueResponse}
          onClose={handleDialogueClose}
        />
      )}

      {state.showEvent && state.currentEvent && (
        <EventModal
          event={state.currentEvent}
          onChoose={handleEventChoose}
          onDismiss={handleEventDismiss}
        />
      )}
    </div>
  );
}
