import type { GameEvent } from '../types/game';

export const EVENTS: GameEvent[] = [
  {
    id: 'professor_corridor',
    icon: '📚',
    title: 'PROFESSOR NO CORREDOR',
    description: 'O Professor Marcos está passando pelo corredor e olha na sua direção.',
    effect: { anxiety: 8 },
    choices: [
      { text: 'Guarda tudo rapidamente', effect: { anxiety: 3 }, feedback: 'Você guardou a tempo. Mas a correria não é boa.' },
      { text: 'Fica tranquilo', effect: { anxiety: -2 }, feedback: 'Nada aconteceu. Às vezes a paranoia é pior.' },
    ],
  },
  {
    id: 'friends_pressure',
    icon: '👥',
    title: 'PRESSÃO DOS AMIGOS',
    description: 'Lucas e Pedro estão insistindo: "Vai usar com a gente!"',
    effect: { anxiety: 10, dependency: 5 },
    choices: [
      { text: 'Cede à pressão', effect: { dependency: 12, health: -5, anxiety: -8 }, feedback: 'Você cedeu. A ansiedade baixou... mas a dependência subiu.' },
      { text: 'Recusa firmemente', effect: { dependency: -3, anxiety: 5 }, feedback: 'Difícil, mas você resistiu. Seu corpo agradece.' },
      { text: 'Diz "talvez depois"', effect: { dependency: 3, anxiety: 3 }, feedback: 'Você adiou. Mas a semente da dependência foi plantada.' },
    ],
  },
  {
    id: 'pod_empty',
    icon: '💨',
    title: 'O POD ACABOU',
    description: 'O líquido do pod acabou. Você sente a falta.',
    effect: { anxiety: 15, dependency: 5 },
    choices: [
      { text: 'Comprar novo (R$ 15)', effect: { money: -15, dependency: 8, health: -3 }, feedback: 'Novo pod comprado. O ciclo continua.' },
      { text: 'Tentar resistir', effect: { anxiety: 12, health: 3 }, feedback: 'Difícil sem ele, mas você está tentando.' },
    ],
  },
  {
    id: 'feeling_bad',
    icon: '🤢',
    title: 'NÃO ESTÁ SE SENTINDO BEM',
    description: 'Tontura leve e dor de cabeça. Seu corpo está avisando.',
    effect: { health: -10, energy: -8 },
    choices: [
      { text: 'Respirar e esperar', effect: { health: 3, anxiety: -5 }, feedback: 'A calma ajudou. O passaio vai passar.' },
      { text: 'Usar para aliviar', effect: { dependency: 8, health: -5, anxiety: -10 }, feedback: 'Aliviou por agora, mas piorou tudo mais.' },
    ],
  },
  {
    id: 'message_parent',
    icon: '📱',
    title: 'MENSAGEM DO RESPONSÁVEL',
    description: '"Tudo bem por aí? Me conta como foi o dia!"',
    effect: { anxiety: 12 },
    choices: [
      { text: 'Responde normalmente', effect: { anxiety: -8 }, feedback: 'Tudo bem. Conversar com família ajuda.' },
      { text: 'Ignora a mensagem', effect: { anxiety: 5 }, feedback: 'Ignorar não resolve. A culpa fica.' },
    ],
  },
  {
    id: 'friend_advice',
    icon: '🧑‍🤝‍🧑',
    title: 'AMIGO PREOCUPADO',
    description: '"Ei, você está usando muito isso. Para com isso, cara."',
    effect: { anxiety: -3 },
    choices: [
      { text: 'Ouve e agradece', effect: { dependency: -5, health: 3, anxiety: -5 }, feedback: 'Alguém se importa com você. Isso importa.' },
      { text: 'Ignora o conselho', effect: { dependency: 3, anxiety: 5 }, feedback: 'Ignorar bons conselhos é fácil. O consequences não.' },
    ],
  },
  {
    id: 'cravings',
    icon: '⚡',
    title: 'WAVE DE CRAVING',
    description: 'Uma vontade forte e repentina. Seu cérebro está pedindo.',
    effect: { dependency: 8, anxiety: 15 },
    choices: [
      { text: 'Respirar fundo 10 vezes', effect: { anxiety: -10, dependency: -2 }, feedback: 'A onda passou. Você é mais forte que isso.' },
      { text: 'Usar para parar', effect: { dependency: 10, health: -4 }, feedback: 'A vontade parou. Mas agora você depende mais.' },
      { text: 'Chamar um amigo', effect: { anxiety: -8, energy: -3 }, feedback: 'Conversar ajudou. Não precisa enfrentar sozinho.' },
    ],
  },
  {
    id: 'cough',
    icon: '🫁',
    title: 'TOSSE PERSISTENTE',
    description: 'Você está tossindo sem parar. As pessoas olham.',
    effect: { health: -8, anxiety: 8 },
    choices: [
      { text: 'Beber água e esperar', effect: { health: 3, anxiety: -3 }, feedback: 'Água ajudou. O corpo está reclamando.' },
      { text: 'Sair da sala', effect: { anxiety: 5 }, feedback: 'Você saiu. Mas o problema continua.' },
    ],
  },
  {
    id: 'good_grade',
    icon: '⭐',
    title: 'NOTA BOA NA PROVA',
    description: 'Você tirou uma nota boa! O dia está melhorando.',
    effect: { anxiety: -10, energy: 5 },
    choices: [
      { text: 'Comemorar', effect: { anxiety: -5 }, feedback: 'Você merece! Foque no positivo.' },
    ],
  },
  {
    id: 'social_media',
    icon: '📱',
    title: 'POST NO INSTAGRAM',
    description: 'Você postou algo e seus amigos estão comentando.',
    effect: { dependency: 5, anxiety: 5 },
    choices: [
      { text: 'Responder todos', effect: { energy: -5, anxiety: 3 }, feedback: 'Redes sociais drenam energia.' },
      { text: 'Desligar o celular', effect: { anxiety: -8, energy: 3 }, feedback: 'Um tempo longe das telas faz bem.' },
    ],
  },
  {
    id: 'exercise',
    icon: '🏃',
    title: 'FEZ EXERCÍCIO',
    description: 'Você caminhou um pouco no pátio. O corpo agradece.',
    effect: { health: 8, energy: -5, anxiety: -5 },
    choices: [
      { text: 'Continuar caminhando', effect: { health: 5, energy: -3 }, feedback: 'Exercício é remédio natural.' },
    ],
  },
  {
    id: 'sleepy',
    icon: '😴',
    title: 'SONO BATENDO',
    description: 'Cansaço batendo forte. Foco difícil de manter.',
    effect: { energy: -12 },
    choices: [
      { text: 'Tomar água fria', effect: { energy: 5 }, feedback: 'Água gelada ajuda um pouco.' },
      { text: 'Usar para acordar', effect: { dependency: 8, energy: 8, health: -3 }, feedback: 'Acordou, mas não da forma certa.' },
    ],
  },
];

export function getRandomEvent(dependency: number): GameEvent | null {
  const chance = Math.min(0.85, 0.25 + dependency * 0.006);
  if (Math.random() > chance) return null;
  const filtered = EVENTS.filter((e) => {
    if (dependency < 20 && e.id === 'cravings') return false;
    if (dependency < 10 && e.id === 'pod_empty') return false;
    return true;
  });
  return filtered[Math.floor(Math.random() * filtered.length)];
}
