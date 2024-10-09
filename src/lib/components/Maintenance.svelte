<!-- src/lib/components/Maintenance.svelte -->
<script>
  // Si vous avez besoin d'importations supplémentaires, faites-le ici
</script>

<div class="maintenance">
  <img src="/404.webp" alt="Page non trouvée">
  <h1>Site en Construction</h1>
  <p>Site en cours de maintenance... Revenez plus tard.</p>
  <a href="/">Retour à l'accueil</a>
</div>

<style>
  .maintenance {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh; /* Centrer verticalement */
      background-color: #f0f0f0; /* Couleur de fond */
  }
  .maintenance img {
      max-width: 100%;
      height: auto;
  }
  .maintenance h1 {
      font-size: 3em;
      margin: 20px 0;
  }
  .maintenance p {
      font-size: 1.5em;
      color: #666;
  }
  .maintenance a {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
  }
  .maintenance a:hover {
      background-color: #0056b3;
  }
</style>
