import type { DialogueLine } from '../types/game';

export const NPC_DIALOGUES: Record<string, DialogueLine[]> = {
  lucas: [
    {
      speaker: 'Lucas',
      text: 'Ei! Chegou cedo hoje. Tá trazendo aquele negócio de novo?',
      responses: [
        { text: 'Só uma vez...', effect: { dependency: 5, anxiety: 3 }, feedback: 'Lucas parece preocupado.' },
        { text: 'Não, parei com isso.', effect: { dependency: -5, health: 3, anxiety: -5 }, feedback: 'Lucas sorri: "Isso aí, cara! Parabéns."' },
        { text: 'Não quero falar disso.', effect: { anxiety: 3 }, feedback: 'Lucas muda de assunto.' },
      ],
    },
    {
      speaker: 'Lucas',
      text: 'O Professor Marcos passou perto da sua mesa antes. Acho que viu algo.',
      responses: [
        { text: 'Sério? Preocupante...', effect: { anxiety: 10 }, feedback: 'Isso não é bom.' },
        { text: 'Não era nada.', effect: { anxiety: -2 }, feedback: 'Tranquilo.' },
      ],
    },
  ],
  professor: [
    {
      speaker: 'Prof. Marcos',
      text: 'Bom dia. Seu trabalho ficou bem feito, mas você parece cansado. Está dormindo direito?',
      responses: [
        { text: 'Sim, professor.', effect: { anxiety: -3 }, feedback: 'Professor assente.' },
        { text: 'Estou bem, obrigado.', effect: { anxiety: -2 }, feedback: 'Professor volta a dar aula.' },
      ],
    },
    {
      speaker: 'Prof. Marcos',
      text: 'Lembre-se: a prova é na semana que vem. Estudem!',
      responses: [
        { text: 'Anotado!', effect: { anxiety: 5 }, feedback: 'Mais uma coisa para se preocupar.' },
      ],
    },
  ],
  marina: [
    {
      speaker: 'Marina',
      text: 'Oii! Tá tudo bem? Você tem andado estranho ultimamente.',
      responses: [
        { text: 'Estou bem, só cansado.', effect: { anxiety: 2 }, feedback: 'Marina não parece convencida.' },
        { text: 'Na verdade... preciso de ajuda.', effect: { dependency: -8, health: 5, anxiety: -10 }, feedback: 'Marina: "Vamos conversar. Estou aqui."' },
        { text: 'Não é da sua conta.', effect: { anxiety: 5 }, feedback: 'Marina se afasta um pouco.' },
      ],
    },
  ],
  pedro: [
    {
      speaker: 'Pedro',
      text: 'Cadê o pod? Deixa eu ver.',
      responses: [
        { text: 'Não, tá guardado.', effect: { dependency: -2, anxiety: 3 }, feedback: 'Pedro: "Tá certo, tá certo."' },
        { text: 'Quer um?', effect: { dependency: 5, anxiety: 3 }, feedback: 'Pedro aceita. Agora vocês dois estão no ciclo.' },
        { text: 'Não tenho mais.', effect: { dependency: -3, health: 2 }, feedback: 'Pedro: "Ah, que bom!"' },
      ],
    },
  ],
};
