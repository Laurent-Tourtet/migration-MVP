<script>
  import { createEventDispatcher } from 'svelte';
  import { fetchWithAuth } from '$lib/api';

  // Import des variables d'environnement
  const directusUrl = import.meta.env.VITE_DIRECTUS_URL;
  const openaiUrl = import.meta.env.VITE_OPENAI_URL;
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  let fileInput;
  const dispatch = createEventDispatcher();

  async function handleUpload() {
    const file = fileInput.files[0];

    if (!file) {
        alert('Veuillez sélectionner un fichier.');
        return;
    }

    // Vérification que le fichier est bien un fichier .sql
    if (file.type !== 'text/plain' && !file.name.endsWith('.sql')) {
        alert('Veuillez sélectionner un fichier .sql valide.');
        return;
    }

    try {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const fileContent = event.target.result;

            try {
                // Requête vers l'API OpenAI pour la conversion
                const conversionResponse = await fetch(openaiUrl,  {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [
                            { role: 'system', content: 'You are a database conversion expert.' },
                            {
                                role: "user",
                                content: `Convert the following PostgreSQL query to MySQL: ${fileContent}`
                            }
                        ],
                        max_tokens: 3000,
                        temperature: 0.3
                    })
                });

                if (!conversionResponse.ok) {
                    const errorText = await conversionResponse.text();
                    throw new Error(`Erreur lors de la conversion du fichier: ${errorText}`);
                }

                const convertedFile = await conversionResponse.json();

                // LOGGING DE LA CONVERSION
                console.log('Contenu converti:', convertedFile.choices[0].message.content);

                // Préparation du formulaire pour l'envoi à Directus
                const formData = new FormData();
                const convertedContent = convertedFile.choices[0].message.content;

                // Assurez-vous que le contenu est une chaîne de caractères valide
                const blob = new Blob([convertedContent], { type: 'text/plain' });
                formData.append('file', blob, 'converted-file.sql');

                // LOGGING DU FORM DATA
                for (const [key, value] of formData.entries()) {
                    console.log(key, value);
                }

                // Requête pour envoyer le fichier converti vers Directus
                const directusResponse = await fetchWithAuth(`${directusUrl}/files`, {
                    method: 'POST',
                    
                    body: formData,
                });

                if (!directusResponse.ok) {
                    const errorText = await directusResponse.text();
                    throw new Error(`Erreur lors du téléversement du fichier à Directus: ${errorText}`);
                }

                const uploadResult = await directusResponse.json();
                dispatch('conversionSuccess', { response: uploadResult });

            } catch (error) {
                console.error('Erreur lors de la conversion ou du téléversement :', error);
                dispatch('conversionError', { error });
            }
        };

        reader.readAsText(file);
    } catch (error) {
        console.error('Erreur lors du téléchargement du fichier :', error);
        alert('Une erreur est survenue lors du téléchargement du fichier.');
    }
}
</script>

<form on:submit|preventDefault={handleUpload}>
  <label for="file">Choisissez un fichier SQL :</label>
  <input id="file" type="file" bind:this={fileInput} accept=".sql" />
  <button type="submit" class="submit-button">Envoyer pour conversion</button>
</form>


<style>
  form {
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    align-items: center;
    font-family: Arial, sans-serif;
  }

  label {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #333;
  }

  input[type="file"] {
    margin-bottom: 20px;
    border: 1px solid #007bff;
    border-radius: 5px;
    padding: 10px;
    font-size: 1rem;
    color: #333;
  }

  .submit-button {
    width: 300px;
    padding: 0.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
    margin-top: 1rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .submit-button:hover {
    background-color: #0056b3;
  }
</style>
