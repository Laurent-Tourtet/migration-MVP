import { authToken, user } from '$lib/stores';

// Fonction pour récupérer le token stocké
export function getStoredToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

// Fonction pour stocker le nouveau token
export function storeToken(token) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        authToken.set(token);
    }
}

// Fonction de génération de mot de passe aléatoire
function generatePassword() {
    return Math.random().toString(36).slice(-8);
}

// Fonction de création d'utilisateur avec génération de mot de passe
export async function createUser(data) {
    console.log('Données de l\'utilisateur à créer:', data);

    try {
        // Vérifie si l'utilisateur existe déjà
        const existingUserResponse = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users?filter[email][_eq]=${data.email}`);
        const existingUserData = await existingUserResponse.json();

        if (existingUserData?.data?.length > 0) {
            console.log("Utilisateur déjà existant avec cet email.");
            return existingUserData.data[0];
        }

        // Génère un mot de passe et ajoute-le aux données de l'utilisateur
        const password = generatePassword();
        const newUser = { ...data, password };

        // Crée l'utilisateur avec le mot de passe généré
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Échec de la création de l\'utilisateur : ' + errorText);
        }

        const createdUser = await response.json();
        console.log(`Mot de passe généré pour ${data.email}: ${password}`);
        return createdUser;
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
}

// Fonction de déconnexion
export function logout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
    authToken.set(null);
    user.set(null);
}

// Fonction de login
export async function login(email, password) {
    const url = `${import.meta.env.VITE_DIRECTUS_URL}/auth/login`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP! Statut: ${errorText}`);
    }

    const data = await response.json();
    storeToken(data.data.access_token);
    authToken.set(data.data.access_token);
    return data;
}

// Fonction pour mettre à jour un utilisateur
export async function updateUser(userId, updates, token) {
    

     // Ajout d'une vérification explicite pour s'assurer que le token est présent
     if (!token) {
        console.error("Token manquant pour l'opération de mise à jour.");
        throw new Error("Erreur: Le token d'authentification est manquant.");
    }
    
    try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users/${userId}`, {
            
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Erreur lors de la mise à jour de l'utilisateur : ${JSON.stringify(data)}`);
        }
        return data;
    } catch (error) {
        console.error("Erreur dans updateUser:", error);
        throw error;
    }
}

// Fonction de réinitialisation de mot de passe avec un token
export async function resetPasswordWithToken(token, password) {
    try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/auth/password/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                password: password
            })
        });

        // Gérer les réponses avec un statut 204 sans lever d'erreur
        if (response.status === 204) {
            return { message: "Réinitialisation réussie." };
        }

        const textResponse = await response.text();
        if (!textResponse) {
            throw new Error("La réponse du serveur est vide.");
        }

        const data = JSON.parse(textResponse);
        if (!response.ok) {
            throw new Error(`Erreur lors de la réinitialisation du mot de passe : ${JSON.stringify(data)}`);
        }

        return data; // Retourner les données si nécessaire
    } catch (error) {
        console.error("Erreur dans resetPasswordWithToken:", error);
        throw error;
    }
}




// Fonction pour vérifier la limite de requêtes de l'utilisateur
export async function checkRequestLimit(token) {
    try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('Données de l\'API Directus :', data); // Assurez-vous de visualiser la réponse

        if (data && data.data) {
            const user = data.data;

            // Incrémentez requests_made
            const updatedRequestsMade = (user.requests_made || 0) + 1;

            // Mettez à jour l'utilisateur avec la nouvelle valeur de requests_made
            await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requests_made: updatedRequestsMade })
            });

            // Vérifiez la limite
            if (user.requests_limit > 0 && updatedRequestsMade > user.requests_limit) {
                return {
                    success: false,
                    message: 'Limite de requêtes atteinte.'
                };
            }

            return {
                success: true,
                message: 'Données récupérées avec succès.',
                userData: user // ou tout autre traitement des données
            };
        } else {
            console.error('Réponse sans la propriété attendue:', data);
            return {
                success: false,
                message: 'La réponse de l\'API n\'est pas au format attendu.'
            };
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de la limite :', error);
        return {
            success: false,
            message: error.message || 'Erreur lors de la vérification de la limite.'
        };
    }
}


// Fonction pour récupérer les informations de profil d'un utilisateur
export async function fetchProfile() {
    const token = getStoredToken();
    console.log("Token récupéré :", token);

    if (!token) {
        console.error("Aucun token trouvé, l'utilisateur peut ne pas être authentifié.");
        return null; // Retourne null si le token n'est pas trouvé
    }


    try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const profileData = await response.json();
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération du profil : ${JSON.stringify(profileData)}`);
        }
        console.log("Données du profil récupérées :", profileData); // Vérifiez la structure des données ici
        return profileData;
    } catch (error) {
        console.error("Erreur dans fetchProfile:", error);
        throw error;
    }
}

// Fonction pour demander la réinitialisation du mot de passe (envoie un email)
export async function passwordReset(email) {
    try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/auth/password/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la demande de réinitialisation de mot de passe : ${errorText}`);
        }

        console.log(`Email de réinitialisation envoyé à : ${email}`);
        return true;
    } catch (error) {
        console.error("Erreur dans passwordReset:", error);
        throw error;
    }
}
