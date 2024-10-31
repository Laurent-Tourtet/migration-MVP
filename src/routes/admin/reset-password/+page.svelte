<script>
  import { page } from '$app/stores';
  // import { onMount } from 'svelte';
  import { resetPasswordWithToken } from '$lib/api';
  import  Header from '$lib/components/Header.svelte';
  import { goto } from '$app/navigation';

  let token = '';
  let newPassword = '';
  let confirmPassword = '';
  let message = '';

  // Extraction du token de l'URL
  $: token = $page.url.searchParams.get('token');
  console.log('Token from URL:', token);
  // Extraction du token de l'URL lors du montage du composant
  // onMount(() => {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   token = searchParams.get('token');
  //   console.log('Token from URL:', token);
  // });

  function validatePassword(password) {
    const minLength = 8;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/; // Vous pouvez ajouter d'autres caractères spéciaux si nécessaire

    if (password.length < minLength) {
      return 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    if (!specialCharPattern.test(password)) {
      return 'Le mot de passe doit contenir au moins un caractère spécial.';
    }
    return null; // Pas d'erreur
  }

  async function handlePasswordReset() {
    if (newPassword !== confirmPassword) {
      message = 'Les mots de passe ne correspondent pas.';
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      message = passwordError;
      return;
    }

    try {
      await resetPasswordWithToken(token, newPassword);
      message = 'Votre mot de passe a été réinitialisé avec succès.';
      goto('/login');  // Redirection après succès
    } catch (error) {
      message = `Erreur: ${error.message}`;
    }
    
  }
</script>
<Header />
<main>
  <h1>Réinitialiser le mot de passe</h1>
  <p>* votre mot de passe doit contenir minimum 8 caractères dont un caractère spécial.</p>
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
        margin: 10px 0;
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
        color: rgb(239, 13, 13);
        text-shadow:  0 0 10px #333;
        /* margin-top: 10px; */
      }
    </style>
    