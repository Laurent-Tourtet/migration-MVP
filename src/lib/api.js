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

// Fonction de génération de mot de passe aléatoire
function generatePassword() {
    return Math.random().toString(36).slice(-8); // Mot de passe de 8 caractères
}

// Fonction de création d'utilisateur avec génération de mot de passe
export async function createUser(data) {
    console.log('Données de l\'utilisateur à créer:', data);

    try {
        // Vérifie si l'utilisateur existe déjà pour éviter la duplication
        const existingUserResponse = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users?filter[email][_eq]=${data.email}`);
        const existingUserData = await existingUserResponse.json();

        if (existingUserData && existingUserData.data && existingUserData.data.length > 0) {
            console.log("Utilisateur déjà existant avec cet email.");
            return existingUserData.data[0]; // retourne l'utilisateur existant pour éviter la duplication
        }

        // Génère un mot de passe et ajoute-le aux données de l'utilisateur
        const password = generatePassword();
        const newUser = {
            ...data,
            password: password
        };

        // Crée l'utilisateur avec le mot de passe généré
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Détails de l\'erreur :', errorText);
            throw new Error('Échec de la création de l\'utilisateur : ' + errorText);
        }

        const createdUser = await response.json();

        // Envoyer un email à l'utilisateur pour lui communiquer son mot de passe (si un service d'envoi d'email est configuré)
        console.log(`Mot de passe généré pour ${data.email}: ${password}`);
        // Logique d'envoi d'email avec le mot de passe ici, si nécessaire

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

// Fonction générique pour faire des requêtes avec authentification
export async function fetchWithAuth(url, options = {}) {
    let token = getStoredToken();

    if (!token) {
        logout();
        throw new Error("Aucun token d'authentification trouvé.");
    }

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    try {
        let response = await fetch(url, options);

        if (response.status === 401) {
            console.log('Token expiré, tentative de rafraîchissement...');
            try {
                token = await refreshToken();  
                options.headers['Authorization'] = `Bearer ${token}`;
                response = await fetch(url, options);  
            } catch {
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

// Fonction pour mettre à jour un utilisateur dans Directus via `users/me`
export async function updateUser(userId, updates) {
    const token = getStoredToken();
    try {
        const response = await fetch(`https://directus.sqlconverter.fr/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });

        const data = await response.json();
        console.log('Réponse de la mise à jour de l\'utilisateur:', data);

        if (!response.ok) {
            throw new Error(`Erreur lors de la mise à jour de l'utilisateur : ${JSON.stringify(data)}`);
        }
        return data;
    } catch (error) {
        console.error("Erreur dans updateUser:", error);
        throw error;
    }
}
