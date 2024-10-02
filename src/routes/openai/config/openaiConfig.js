 import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY ;

if (!apiKey) {
  console.error("La clé API OpenAI est manquante ou vide.");
}

const openai = new OpenAI({
  apiKey: apiKey,
});

export default openai;







