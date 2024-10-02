<script>
  
  import { user} from '$lib/stores';
  let file;
  let fileName = '';
  let message = '';
  let loading = false;
  
   
  
    
  
    async function uploadFile() {
      if (!file) {
        alert('Veuillez sélectionner un fichier');
        return;
      }
  
  
      loading = true;  // Démarrer l'animation de chargement
  
      // Lire le contenu du fichier
      const fileContent = await file.text();

        // Récupérer le token stocké (côté client)
    const token = localStorage.getItem('token');
    console.log('Token récupéré:', token); // Afficher le token dans la console
  
      // Envoyer le fichier au serveur pour conversion
      const response = await fetch('/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fileContent })
      });

      if (!response.ok) {
    const errorText = await response.text();
    console.error('Erreur de conversion côté serveur :', errorText);
    alert(`Erreur lors de la conversion : ${errorText}`);
    return;
}

const data = await response.json();
console.log('Réponse après conversion :', data);
    }
  
      function triggerFileInput() {
          document.getElementById('file-input').click();
      }
  
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
  