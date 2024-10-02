<script>
  import { user } from '$lib/stores';
  let file;
  let fileName = '';
  let message = '';
  let errorMessage = '';
  let loading = false;
  let convertedContent = '';
  let fileId = ''; // Stocker l'ID du fichier converti
  
  // Fonction pour téléverser le fichier et déclencher la conversion
  async function uploadFile() {
      if (!file) {
          alert('Veuillez sélectionner un fichier.');
          return;
      }

      loading = true; // Démarrer l'animation de chargement
      errorMessage = ''; // Réinitialiser les messages d'erreur et de succès
      message = '';
      convertedContent = '';

      try {
          // Lire le contenu du fichier sélectionné
          const fileContent = await file.text();

          // Récupérer le token d'authentification stocké (côté client)
          const token = localStorage.getItem('token');
          if (!token) {
              throw new Error('Aucun token trouvé. Veuillez vous authentifier.');
          }
          console.log('Token récupéré:', token); // Afficher le token dans la console

          // Envoyer le contenu du fichier au serveur pour conversion
          const response = await fetch('/convert', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ fileContent })
          });

          loading = false; // Arrêter l'animation de chargement

          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Erreur de conversion côté serveur : ${errorText}`);
          }

          const data = await response.json();
          console.log('Données de réponse:', data); // Vérifier la structure des données

          message = 'Fichier converti avec succès.';
          convertedContent = data.uploadedFile; // Nom du fichier converti
          fileId = data.fileId; // Stocker l'ID du fichier converti si nécessaire
          console.log('Nom du fichier converti:', convertedContent);

      } catch (error) {
          loading = false;
          console.error('Erreur lors du téléversement ou de la conversion :', error);
          errorMessage = `Erreur : ${error.message}`;
      }
  }

  // Fonction pour ouvrir le sélecteur de fichiers
  function triggerFileInput() {
      document.getElementById('file-input').click();
  }

  // Fonction pour gérer le changement de fichier
  function handleFileChange(event) {
      file = event.target.files[0];
      fileName = file ? file.name : '';
  }
</script>

<form on:submit|preventDefault={uploadFile}>
  <label for="file">Choisissez un fichier SQL :</label>
  <input id="file" type="file" on:change={handleFileChange} accept=".sql" />
  <button type="submit" class="submit-button">Envoyer pour conversion</button>
</form>

{#if loading}
  <p>Chargement en cours...</p>
{/if}

{#if message}
  <p>{message}</p>
{/if}

{#if errorMessage}
  <p style="color: red;">{errorMessage}</p> <!-- Affiche le message d'erreur -->
{/if}

{#if convertedContent}
  <div class="converted-content">
      <h3>Fichier converti :</h3>
      <p>Téléchargez votre fichier : 
          <a href={`https://www.sqlconverter.fr/files/${convertedContent}`} download>{convertedContent}</a>
      </p>
  </div>
{/if}

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

  .converted-content {
      margin-top: 20px;
      border: 1px solid #007bff;
      border-radius: 5px;
      padding: 10px;
      background-color: #f9f9f9;
      width: 100%;
  }
</style>
