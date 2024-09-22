<script>
  // Import correct de la fonction uploadFile depuis api.js
  import { uploadFile } from '$lib/api';
  let file;
  let fileName = '';
  let message = '';
  let loading = false;

  // Fonction pour téléverser le fichier
  async function handleUploadFile() {
   
    // Vérification si un fichier est sélectionné
    if (!file) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    loading = true;
    console.log('Téléversement démarré'); // Log pour suivre le démarrage

    try {
      // Création de l'objet FormData pour l'upload
      const formData = new FormData();
      formData.append('file', file);
      console.log('FormData créé avec le fichier:', file); // Log pour vérifier le fichier

      // Appel de la fonction upload dans api.js
      const response = await uploadFile(formData);  // Correction ici avec le bon nom de fonction
      console.log('Réponse de l\'API Directus:', response); // Log pour suivre la réponse

      // Vérification de la réponse de l'API
      if (!response.ok) {
        throw new Error('Échec du téléversement'); // Log en cas d'échec
      }

      const data = await response.json();
      console.log('Téléversement réussi, réponse de l\'API:', data); // Log en cas de succès

      message = 'Fichier téléversé avec succès';
    } catch (error) {
      console.error('Erreur lors du téléversement:', error); // Log pour capturer les erreurs
      message = 'Erreur lors du téléversement';
    } finally {
      loading = false;
      console.log('Téléversement terminé'); // Log pour indiquer que le processus est fini
    }
  }

  // Fonction pour déclencher la sélection de fichier
  function triggerFileInput() {
    document.getElementById('file-input').click();
  }

  // Fonction pour gérer le changement de fichier
  function handleFileChange(event) {
    file = event.target.files[0];
    fileName = file ? file.name : '';
    console.log('Fichier sélectionné:', fileName); // Log pour suivre le fichier sélectionné
  }
</script>

<!-- Formulaire de téléversement -->
<form on:submit|preventDefault={handleUploadFile}>
  <!-- Input caché pour le fichier -->
  <input id="file-input" type="file" accept=".sql" style="display:none" on:change={handleFileChange} />

  <!-- Bouton pour sélectionner un fichier -->
  <button type="button" on:click={triggerFileInput} class="file-select-button">
    Choisir un fichier à convertir en MySQL
    <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 10l5 5 5-5H7z"/>
    </svg>
  </button>

  <!-- Afficher le nom du fichier si un fichier est sélectionné -->
  {#if fileName}
    <div class="file-info"><img id="logo-file" src="sql.png"> {fileName}</div>
  {/if}

  <!-- Bouton de soumission -->
  <button type="submit" class="submit-button" disabled={loading}>Convertir</button>

  <!-- Message de conversion en cours -->
  {#if loading}
    <p>Conversion en cours...</p>
  {/if}

  <!-- Message de succès ou d'erreur -->
  {#if message}
    <p>{message}</p>
  {/if}
</form>




<!-- {:else}
<p>Veuillez vous connecter pour accéder à ce service</p>
{/if} -->

<style>
  form {
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    align-items: center;
    font-family: Arial, sans-serif;
  }

  .file-select-button {
    width: 600px;
    padding: 0.5rem;
    background-color: #f8f9fa;
    border: 1px solid #007bff;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 1rem;
    text-align: center;
    color: #007bff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .file-select-button:hover {
    background-color: #e2e6ea;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .file-info {
    border: 1px solid #007bff;
    border-radius: 5px;
    margin-top: 0.5rem;
    padding: 10px;
    font-size: 1.3rem;
    color: #1c1e1f;
  }

  #logo-file {
    width: 30px;
    height: 30px;
    margin-right: 10px;
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

  .icon {
    width: 2rem;
    height: 2rem;
    fill: currentColor;
    margin-left: 0.5rem;
  }
</style>
