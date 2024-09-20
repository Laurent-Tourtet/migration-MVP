<script>
  import { user } from '$lib/stores';
  import { uploadFile } from '$lib/api'; // Importer la fonction d'API
  let file;
  let fileName = '';
  let message = '';
  let loading = false;

  async function handleUpload() {
    if (!file) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    loading = true; // Démarrer l'animation de chargement

    // Lire le contenu du fichier
    const fileContent = await file.text();

    try {
      const data = await uploadFile(fileContent, user.token); // Appeler la fonction d'API
      message = 'Fichier converti avec succès. Téléchargement en cours...';

      // Téléchargement automatique du fichier
      const a = document.createElement('a');
      a.href = data.filePath; // Assure-toi que `filePath` est correct dans la réponse
      a.download = 'converted.sql';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      message = error.message; // Afficher l'erreur
    } finally {
      loading = false; // Arrêter l'animation de chargement
    }
  }

  function triggerFileInput() {
    document.getElementById('file-input').click();
  }

  function handleFileChange(event) {
    file = event.target.files[0];
    fileName = file ? file.name : '';
  }
</script>

<form on:submit|preventDefault={handleUpload}>
  <input id="file-input" type="file" accept=".sql" style="display:none" on:change={handleFileChange} />

  <button type="button" on:click={triggerFileInput} class="file-select-button">
    Choisir un fichier à convertir en MySQL
    <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 10l5 5 5-5H7z"/>
    </svg>
  </button>

  {#if fileName}
    <div class="file-info"><img id="logo-file" src="sql.png"> {fileName}</div>
  {/if}

  <button type="submit" class="submit-button" disabled={loading}>Convertir</button>

  {#if loading}
    <p>Conversion en cours...</p>
  {/if}

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
