import { writable } from 'svelte/store';

// Fonction pour créer un store persistant dans localStorage, mais uniquement côté client
function createPersistentStore(key, initialValue) {
    let value = initialValue;

    // Vérifie si on est côté client (pour éviter les erreurs SSR)
    if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem(key);
        value = storedValue ? JSON.parse(storedValue) : initialValue;
    }

    const store = writable(value);

    // Abonnement pour mettre à jour localStorage (uniquement côté client)
    if (typeof window !== 'undefined') {
        store.subscribe(currentValue => {
            localStorage.setItem(key, JSON.stringify(currentValue));
        });
    }

    return store;
}




// Utilisez la fonction pour créer un store persistant pour le mode maintenance
export const isMaintenanceMode = createPersistentStore('isMaintenanceMode', false);
export const authToken = writable(null);
export const user = writable(null);

export function setUser(data) {
    console.log('Données utilisateur :', data);
    user.set({
        id: data.user_id,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        location: data.location,
    });
}
