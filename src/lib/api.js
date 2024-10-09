import { authToken, user } from '$lib/stores';

// Fonction pour récupérer le token stocké
export function getStoredToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null; // Côté serveur, on ne peut pas accéder à localStorage
}

// Fonction pour stocker le nouveau token
export function storeToken(token) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        authToken.set(token);
    }
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

    if (!token) {
        logout();
        throw new Error("Aucun token d'authentification trouvé.");
    }

    if (!options.headers) {
        options.headers = {};
    }

    options.headers['Authorization'] = `Bearer ${token}`;
    options.headers['Content-Type'] = 'application/json';

    try {
        let response = await fetch(url, options);

        if (response.status === 401) {
            console.log('Token expiré, tentative de rafraîchissement...');
            try {
                token = await refreshToken();  
                options.headers['Authorization'] = `Bearer ${token}`;
                response = await fetch(url, options);  
            } catch (refreshError) {
                throw new Error('Échec du rafraîchissement du token et nouvelle tentative échouée.');
            }
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur HTTP! Statut: ${response.status}, ${errorText}`);
        }

        return response.status === 204 ? null : await response.json();  
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
    storeToken(data.data.access_token);  
    authToken.set(data.data.access_token);  
    return data;
}

// Fonction de création d'un utilisateur
export async function createUser(data) {
    console.log('Données envoyées :', data); 
    try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Détails de l\'erreur :', errorText); 
            throw new Error('Échec de la création de l\'utilisateur : ' + errorText); 
        }

        return await response.json();
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
            console.log('Email de réinitialisation envoyé avec succès.');
            return true;
        } else {
            const errorText = await response.text();
            throw new Error('Erreur lors de la demande de réinitialisation: ' + errorText);
        }
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        throw error;
    }
}

// Fonction pour réinitialiser le mot de passe avec un token
export async function resetPasswordWithToken(token, password) {
    try {
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/auth/password/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, password })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Erreur lors de la réinitialisation du mot de passe: ' + errorText);
        }

        const data = await response.json();
        console.log('Mot de passe réinitialisé avec succès:', data);
        return data;
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        throw error;
    }
}

// Nouvelle fonction : Vérification de la limite de requêtes
export async function checkRequestLimit(userId) {
    try {
        const user = await fetchWithAuth(`${import.meta.env.VITE_DIRECTUS_URL}/users/${userId}`);
        
        // Si l'utilisateur a une limite de requêtes définie (0 pour unlimited)
        if (user.requests_limit > 0 && user.requests_made >= user.requests_limit) {
            throw new Error('Vous avez atteint la limite de requêtes pour votre abonnement.');
        }
        console.log('user.requests_made', user.requests_made);
        // Incrémenter le compteur de requêtes
        user.requests_made += 1;
        
        // Sauvegarder la nouvelle valeur dans Directus
        await fetchWithAuth(`${import.meta.env.VITE_DIRECTUS_URL}/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({ requests_made: user.requests_made })
        });
        
    } catch (error) {
        console.error('Erreur lors de la vérification des limites de requêtes:', error);
        throw error;
    }
}
