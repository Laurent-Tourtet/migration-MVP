import { json } from '@sveltejs/kit';
import { fetchWithAuth } from '$lib/api';
import openai from '../openai/config/openaiConfig';
import { v4 as uuidv4 } from 'uuid';

// Fonction utilitaire pour détecter le dialecte
function detectDialect(fileContent) {
    if (fileContent.includes('SERIAL')) {
        return 'PostgreSQL';
    }
    return 'Unknown';
}

// Fonction pour convertir PostgreSQL à MySQL via OpenAI
async function convertToMySQL(fileContent, dialect) {
    console.log(`Dialecte détecté: ${dialect}`);
    if (dialect === 'PostgreSQL') {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a database conversion expert.' },
                    { role: 'user', content: `Convert the following PostgreSQL query to MySQL: ${fileContent}` }
                ],
                max_tokens: 3000,
                temperature: 0.3
            });

            if (response && response.choices && response.choices.length > 0) {
                return response.choices[0].message.content.trim();
            } else {
                throw new Error('Réponse de l\'API OpenAI vide ou mal formatée.');
            }
        } catch (error) {
            console.error('Erreur lors de la conversion :', error);
            throw new Error('Erreur lors de la conversion.');
        }
    } else {
        throw new Error('Dialecte non reconnu ou non pris en charge.');
    }
}

// Fonction pour téléverser le fichier converti dans Directus
async function uploadToDirectus(fileName, content) {
    const formData = new FormData();
    const file = new File([content], fileName, { type: 'text/plain' });
  
    formData.append('file', file, fileName);

    const response = await fetchWithAuth(`${import.meta.env.VITE_DIRECTUS_URL}/files`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Échec du téléversement : ${errorText}`);
    }

    return await response.json();
}

// Fonction pour gérer la requête POST
export async function POST({ request }) {
    try {
        const { fileContent } = await request.json();
        const detectedDialect = detectDialect(fileContent);
        
        if (detectedDialect === 'Unknown') {
            return json({ message: 'Erreur : dialecte non pris en charge.' }, { status: 400 });
        }

        const convertedContent = await convertToMySQL(fileContent, detectedDialect);

        if (!convertedContent || convertedContent.includes('Erreur')) {
            return json({ message: 'Erreur : conversion échouée.' }, { status: 400 });
        }

        const uploadedFile = await uploadToDirectus(`${uuidv4()}.sql`, convertedContent);
        
        return json({ message: 'Conversion réussie', uploadedFile });
    } catch (error) {
        console.error('Erreur lors de la conversion :', error.message || error);
        return json({ message: 'Erreur lors de la conversion du fichier.' }, { status: 500 });
    }
}
