<script>
  import { uploadFile } from '$lib/api';
  let file;
  let fileName = '';
  let message = '';
  let loading = false;
  let fileContent = ''; // Variable pour stocker le contenu du fichier

  async function handleUploadFile() {
    if (!file) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    loading = true;
    console.log('Téléversement démarré');

    try {
      const formData = new FormData();
      formData.append('file', file);
      console.log('FormData créé avec le fichier:', file);

      // Téléversement du fichier
      const { fileData, fileContent: uploadedFileContent } = await uploadFile(formData);
      console.log('Réponse de l\'API Directus:', fileData);
      console.log('Contenu du fichier:', uploadedFileContent);

      fileContent = uploadedFileContent; // Stocke le contenu du fichier pour l'affichage

      message = 'Fichier téléversé avec succès';
    } catch (error) {
      console.error('Erreur lors du téléversement:', error);
      message = 'Erreur lors du téléversement';
    } finally {
      loading = false;
      console.log('Téléversement terminé');
    }
  }

  // Déclencher la sélection du fichier
  function triggerFileInput() {
    document.getElementById('file-input').click();
  }

  // Gérer le changement de fichier
  function handleFileChange(event) {
    file = event.target.files[0];
    fileName = file ? file.name : '';
    console.log('Fichier sélectionné:', fileName);
  }
</script>

<!-- Formulaire de téléversement -->
<form on:submit|preventDefault={handleUploadFile}>
  <!-- Input caché pour le fichier -->
  <input id="file-input" type="file" accept=".sql" style="display:none" on:change={handleFileChange} />

  <!-- Bouton pour sélectionner un fichier -->
  <button type="button" on:click={triggerFileInput} class="file-select-button">
    Choisir un fichier à convertir en MySQL
  </button>

  <!-- Afficher le nom du fichier si un fichier est sélectionné -->
  {#if fileName}
    <div class="file-info">Nom du fichier: {fileName}</div>
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

  <!-- Affichage du contenu du fichier converti -->
  {#if fileContent}
    <div class="file-content">
      <h3>Contenu du fichier converti :</h3>
      <pre>{fileContent}</pre>
    </div>
  {/if}
</form>

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

  .file-content {
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: monospace;
  }

  pre {
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 5px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
