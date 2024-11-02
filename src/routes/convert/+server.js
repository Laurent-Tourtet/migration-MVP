import { json } from '@sveltejs/kit';
import { checkRequestLimit } from '$lib/api';
import { v4 as uuidv4 } from 'uuid';

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
Tu es un expert en base de données, ta tâche est de convertir des requêtes PostgreSQL en MySQL en prenant en compte les spécificités suivantes :
1. Remplacer le type SERIAL par INT AUTO_INCREMENT.
2. Les triggers doivent être écrits avec la syntaxe MySQL, en utilisant BEGIN ... END; et en mettant à jour les stocks dans la table 'products' après l'insertion d'items.
3. Les fonctions PL/pgSQL doivent être converties en procédures MySQL et utiliser la clause DELIMITER.
4. Remplacer la fonction ILIKE par LIKE en utilisant CONCAT.
5. Si une séquence ou fonction PostgreSQL n'est pas supportée dans MySQL, proposer une alternative via des requêtes séparées ou une logique au niveau de l'application.
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
        const { fileContent } = await request.json();
        const authHeader = request.headers.get('Authorization');

        if (!authHeader) {
            return json({ message: 'Erreur : Aucun token d\'authentification trouvé.' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];  // Extrait le token après "Bearer "
        console.log('Token reçu :', token);

        const limitCheck = await checkRequestLimit(token);
        console.log('Résultat de limitCheck :', limitCheck); 

        if (!limitCheck.success) {
            // Si l'utilisateur a atteint sa limite, retourner une réponse appropriée
            return new Response(limitCheck.message, { status: 403 });  // Statut HTTP 403 : Interdit
        }
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
