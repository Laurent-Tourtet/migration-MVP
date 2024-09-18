<script>
    import { page } from '$app/stores';
    import { resetPasswordWithToken } from '$lib/api';
    import { goto } from '$app/navigation';
  
    let token = '';
    let newPassword = '';
    let confirmPassword = '';
    let message = '';
  
    // Extraction du token de l'URL
    $: token = $page.url.searchParams.get('token');
    console.log('Token from URL:', token);
  
    async function handlePasswordReset() {
      if (newPassword !== confirmPassword) {
        message = 'Les mots de passe ne correspondent pas.';
        return;
      }
  
      try {
        await resetPasswordWithToken(token, newPassword);
        message = 'Votre mot de passe a été réinitialisé avec succès.';
      } catch (error) {
        message = `Erreur: ${error.message}`;
      }
      goto('/login');
    }
  </script>
  
  <main>
    <h1>Réinitialiser le mot de passe</h1>
    <input type="password" bind:value={newPassword} placeholder="Nouveau mot de passe" required />
    <input type="password" bind:value={confirmPassword} placeholder="Confirmer le mot de passe" required />
    <button on:click={handlePasswordReset}>Réinitialiser</button>
    {#if message}
      <p>{message}</p>
    {/if}
  </main>
    
    <style>
      main {
        width: 50%;
        border-radius: 15px;
        padding: 20px 0;
        background-color: #063b69;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 100px auto 0 auto;
        box-shadow: 0 0 10px #333;
      }
    
      h1 {
        color: #3acdde;
        padding-bottom: 10px;
      }
    
      input {
        display: block;
        margin: 10px 0;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    
      button {
        margin-top: 5px;
        background-color: #3bd1e1;
        color: #063b69;
        border: 1px solid #fbf9f9;
        margin-right: 10px;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: inset 0 0 10px #333;
      }
    
      button:hover {
        background-color: #12b262;
        color: white;
      }
    
      p {
        color: white;
        margin-top: 20px;
      }
    </style>
    