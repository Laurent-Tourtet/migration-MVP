import { json } from '@sveltejs/kit';
import openai from '../openai/config/openaiConfig';
import { v4 as uuidv4 } from 'uuid';
import { checkRequestLimit } from '$lib/api'; // Importer la fonction depuis api.js

// Import des variables d'environnement
const directusUrl = import.meta.env.VITE_DIRECTUS_URL;
const openaiUrl = import.meta.env.VITE_OPENAI_API_URL;
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

console.log('URL OpenAI :', openaiUrl);

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
            const response = await fetch(openaiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content:  `
Tu es un expert en base de données, ta tâche est de convertir des requêtes PostgreSQL en MySQL...
`
                        },
                        {
                            role: "user",
                            content: fileContent
                        }
                    ]
                })
            });

            const data = await response.json();
            console.log('Données après conversion en JSON :', data);

            // Vérifiez si la réponse est valide avant d'aller plus loin
            if (!data.choices || !data.choices[0]) {
                throw new Error('Réponse de l\'API OpenAI vide ou mal formatée.');
            }

            // Retourne les données converties si tout est valide
            return data.choices[0].message.content.trim();

        } catch (error) {
            console.error('Erreur lors de la conversion OpenAI :', error);
            throw new Error(`Erreur lors de la conversion OpenAI : ${error.message}`);
        }
    } else {
        throw new Error('Dialecte non reconnu ou non pris en charge.');
    }
}

// Fonction pour téléverser le fichier converti dans Directus
async function uploadToDirectus(fileName, content, token) {
    const formData = new FormData();
    const file = new File([content], fileName, { type: 'text/plain' });
  
    formData.append('file', file, fileName);

    const response = await fetch(`${directusUrl}/files`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`  // Ajout du token dans les headers
        },
        body: formData
    });

    const responseData = await response.json(); // Convertis la réponse en JSON

    console.log('Réponse de Directus :', responseData);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Échec du téléversement : ${errorText}`);
    }

    return responseData.data; // On retourne uniquement la propriété "data" qui contient les infos du fichier
}

// Fonction pour gérer la requête POST
export async function POST({ request }) {
    try {
        const { fileContent, userId } = await request.json();  // Inclure userId pour identifier l'utilisateur
        const authHeader = request.headers.get('Authorization');

        if (!authHeader) {
            return json({ message: 'Erreur : Aucun token d\'authentification trouvé.' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];  // Extrait le token après "Bearer "

        // **Vérifier la limite de requêtes**
        await checkRequestLimit(userId);  // Vérifie et met à jour la limite de requêtes de l'utilisateur

        // Détection du dialecte
        const detectedDialect = detectDialect(fileContent);

        if (detectedDialect === 'Unknown') {
            return json({ message: 'Erreur : dialecte non pris en charge.' }, { status: 400 });
        }

        const convertedContent = await convertToMySQL(fileContent, detectedDialect);

        console.log('Type de convertedContent:', typeof convertedContent);
        console.log('Valeur de convertedContent:', convertedContent);

        if (!convertedContent || convertedContent.includes('Erreur')) {
            return json({ message: 'Erreur : conversion échouée.' }, { status: 400 });
        }

        const uploadedFile = await uploadToDirectus(`Convert_${uuidv4()}.sql`, convertedContent, token);

        // On retourne l'ID du fichier pour le lien de téléchargement
        if (uploadedFile && uploadedFile.id) {
            return json({ message: 'Conversion réussie', fileId: uploadedFile.id });
        } else {
            return json({ message: 'Erreur : Téléversement réussi mais pas de fichier disponible.' }, { status: 500 });
        }

    } catch (error) {
        console.error('Erreur lors de la conversion :', error.message || error);
        return json({ message: `Erreur lors de la conversion du fichier : ${error.message}` }, { status: 500 });
    }
}
