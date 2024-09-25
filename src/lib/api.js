import { authToken, user } from '$lib/stores';

// Fonction pour récupérer le token stocké
export function getStoredToken() {
    return localStorage.getItem('token');
}

// Fonction pour stocker le nouveau token
export function storeToken(token) {
    localStorage.setItem('token', token);
    authToken.set(token);  // Met à jour le store Svelte
}

// Fonction pour rafraîchir le token
export async function refreshToken() {
    const currentToken = getStoredToken();
    
    try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Échec du rafraîchissement du token.');
        }

        const data = await response.json();
        storeToken(data.data.access_token); // Stocker le nouveau token
        return data.data.access_token;
    } catch (error) {
        console.error('Erreur lors du rafraîchissement du token :', error);
        logout();  // Si le rafraîchissement échoue, déconnexion
        throw error;
    }
}

// Fonction générique pour faire des requêtes avec authentification
export async function fetchWithAuth(url, options = {}) {
    let token = getStoredToken();

    // Si le token n'existe pas, déconnecter l'utilisateur
    if (!token) {
        logout();
        throw new Error("Aucun token d'authentification trouvé.");
    }

    // Ajout des en-têtes si non présents
    if (!options.headers) {
        options.headers = {};
    }

    options.headers['Authorization'] = `Bearer ${token}`;
    options.headers['Content-Type'] = 'application/json';

    try {
        let response = await fetch(url, options);

        // Si le token a expiré (401 Unauthorized), essayer de le rafraîchir
        if (response.status === 401) {
            console.log('Token expiré, tentative de rafraîchissement...');
            try {
                token = await refreshToken();  // Rafraîchit le token
                options.headers['Authorization'] = `Bearer ${token}`;
                response = await fetch(url, options);  // Répète la requête avec le nouveau token
            } catch {
                throw new Error('Échec du rafraîchissement du token et nouvelle tentative échouée.');
            }
        }

        // Si la réponse est toujours invalide, lever une erreur
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur HTTP! Statut: ${response.status}, ${errorText}`);
        }

        return response.status === 204 ? null : response.json();  // Si la réponse est vide, ne pas renvoyer de JSON
    } catch (error) {
        console.error('Erreur lors de la requête fetchWithAuth:', error);
        throw error;
    }
}

// Fonction de login
export async function login(email, password) {
    const url = `${import.meta.env.VITE_DIRECTUS_URL}/auth/login`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP! Statut: ${errorText}`);
    }

    const data = await response.json();
    console.log('Réponse login API:', data);
    storeToken(data.data.access_token);  // Stocker le token d'accès
    authToken.set(data.data.access_token);  // Met à jour le store Svelte
    return data;
}

// Fonction de création d'un utilisateur
export async function createUser(data) {
    try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users`, {
            method: 'POST',
            headersrs: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Échec de la création de l\'utilisateur.');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
}

// Fonction de déconnexion
export function logout() {
    authToken.set(null);
    user.set(null);
    localStorage.removeItem('token');
}

// Fonction pour récupérer le profil utilisateur
export async function fetchProfile() {
    let token = getStoredToken();

    if (!token) {
        throw new Error("Aucun token d'authentification trouvé.");
    }

    const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Échec de la récupération du profil.");
    }

    const data = await response.json();
    user.set(data.data);
    return data.data;
}

// Fonction pour réinitialiser le mot de passe
export async function passwordReset(email) {
    try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/auth/password/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.status === 204) {
            return { message: 'Un email de réinitialisation a été envoyé.' };
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Échec de la demande de réinitialisation: ${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        throw error;
    }
}

// Fonction pour réinitialiser le mot de passe avec le token
export async function resetPasswordWithToken(token, newPassword) {
    try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/auth/password/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                password: newPassword,
                confirm_password: newPassword
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Échec de la réinitialisation du mot de passe: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        throw error;
    }
}

      
     // upload a file to the API
export async function uploadFile(formData) {
    const token = localStorage.getItem('token'); // Récupération du token d'authentification
console.log('Token utilisé pour le téléversement:', token);
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/files`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,  // Envoi du token avec la requête
        },
        body: formData // Envoi du fichier
    });

    if (!response.ok) {
    const errorResponse = await response.json();
    console.error('Erreur lors du téléversement:', errorResponse);
    throw new Error(`Échec du téléversement: ${response.status} - ${errorResponse.message}`);
}

    return await response.json();
}
