import { authToken, user} from '$lib/stores';

export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!options.headers) {
        options.headers = {};
    }
    options.headers['Authorization'] = `Bearer ${token}`;
    options.headers['Content-Type'] = 'application/json';

    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, ${errorText}`);
        }
        // return null if the response status is 204 (No Content)
        if (response.status === 204) {
            return null;
        }

        // return the response JSON if the content type is application/json
        return response.json();
    } catch(error){
        console.error('Fetch error:', error);
    }
    }

    // Call the API to log in the user

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
            throw new Error(`HTTP error! Status: ${errorText}`);
        }

        const data = await response.json();
        console.log('API login response:', data);
        localStorage.setItem('token',data.data.access_token);
        authToken.set(data.data.access_token);
        return data;
    }

    // callthe API to create a new user

    export async function createUser(data) {
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_DIRECTUS_URL}/users`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log('API login respoinse:', data);
            if (!response.ok) {
                throw new Error('Failed to create user');
            }
            return await response.json();
        } catch(error) {
            console.error('Error creating user:', error);
            throw error;
        }

    }

    // deconnect the user by removing the token from local storage
    export function logout() {
        authToken.set(null);
    user.set(null);
    localStorage.removeItem('token');
    }

    // get the current user from the API

    export async function fetchProfile() {
        let token;
        authToken.subscribe(value => {
          token = value;
        })();
      
        if (!token) {
          token = localStorage.getItem('token');
        }
      
        if (!token) {
          throw new Error("No auth token found");
        }
      
        const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // test if the response is ok
        console.log('API fetchProfile response:', response); 
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
      
        const data = await response.json();
       
        user.set(data.data);
        console.log(data);
        return data.data;
       
      }
    //   reset the user password
    
    export async function passwordReset(email) {
        try {
          const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/auth/password/request`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
          });
      
          // Vérification du statut 204 No Content
          if (response.status === 204) {
            return { message: 'Un email de réinitialisation a été envoyé à votre adresse.' };
          }
      
          // Vérification pour tous les autres statuts non 2xx
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to request password reset: ${response.status} - ${errorText}`);
          }
      
          // Essayer de parser le JSON uniquement si le contenu existe
          const responseText = await response.text();
          if (responseText) {
            return JSON.parse(responseText);
          } else {
            return { message: 'Aucune réponse reçue, mais la requête a réussi.' };
          }
        } catch (error) {
          console.error('Error requesting password reset:', error);
          throw error;
        }
      }
       
      export async function resetPasswordWithToken(token, newPassword) {
        try {
          const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/auth/password/reset`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token: token,  // Token de réinitialisation
              password: newPassword,
              confirm_password: newPassword
            })
          });
      
          // Vérifie le statut HTTP de la réponse
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur de réinitialisation avec token:', errorText);
            throw new Error(`Failed to reset password: ${response.status} - ${errorText}`);
          }
      
          // Essaye de lire le texte brut de la réponse
          const responseText = await response.text();
          
          // Si la réponse est vide, ne pas tenter de parser en JSON
          if (!responseText) {
            return { message: 'Mot de passe réinitialisé avec succès.' };
          }
      
          return JSON.parse(responseText);
        } catch (error) {
          console.error('Error resetting password with token:', error);
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
