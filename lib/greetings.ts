/**
 * Dynamic Greeting Utility for pickNdrop
 * Randomizes greeting text on each component mount / app open.
 */

const GREETING_TEMPLATES: string[] = [
  "Hey {name} 👋",
  "Are you hungry, {name}?",
  "What's there to eat, {name}?",
  "Craving something good, {name}?",
  "What are we having today, {name}?",
  "Time for lunch, {name}?",
  "Fuel up for class, {name}!",
  "What's on your mind, {name}?",
];

/**
 * Returns a randomized greeting string featuring the user's name.
 * @param name The user's first name or display name. Defaults to "Paul".
 */
export function getRandomGreeting(name: string = "Paul"): string {
  const randomIndex = Math.floor(Math.random() * GREETING_TEMPLATES.length);
  const template = GREETING_TEMPLATES[randomIndex];
  return template.replace("{name}", name);
}

/**
 * Fallback / default greeting for initial SSR render before hydration.
 */
export function getDefaultGreeting(name: string = "Paul"): string {
  return `Hey ${name} 👋`;
}
