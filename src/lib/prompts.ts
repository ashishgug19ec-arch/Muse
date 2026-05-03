const PROMPTS = [
  "What did the moon witness last night that you haven't yet put into words?",
  "Write about a feeling that has no name in English.",
  "Describe the last time silence felt loud.",
  "What would you say to the version of yourself from one year ago?",
  "Write about something ordinary that became sacred.",
  "Describe a goodbye that nobody said out loud.",
  "What does home smell like when you've been away too long?",
  "Write about the space between two heartbeats.",
  "Describe something you've been carrying that has no weight.",
  "What does your grief look like when nobody is watching?",
  "Write about a door you've never opened.",
  "Describe the colour of your favourite memory.",
  "What would the rain say if it could speak?",
  "Write about something that broke beautifully.",
  "Describe the feeling of almost — almost ready, almost there, almost enough.",
  "What does forgiveness feel like in the body?",
  "Write about a version of yourself that no longer exists.",
  "Describe the last moment before everything changed.",
  "What lives in the corner of your eye that disappears when you look directly at it?",
  "Write about something you inherited that you never asked for.",
  "Describe what courage tastes like.",
  "Write about the thing you keep starting and never finishing.",
  "What does your name sound like in a language you don't speak?",
  "Describe the feeling of a Sunday evening in autumn.",
  "Write about something you lost that you didn't know you had.",
  "What does the first line of your best poem look like?",
  "Describe a letter you'll never send.",
  "Write about the last thing that made you catch your breath.",
  "What does your ikigai feel like on the days it's very clear?",
  "Describe the exact moment you knew you were a writer.",
];

/** Returns today's writing prompt based on day of year. */
export function getDailyPrompt(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  return PROMPTS[dayOfYear % PROMPTS.length];
}
