<script>

import {login, fetchProfile} from '$lib/api';
import {authToken, user} from '$lib/stores';
import {goto} from '$app/navigation';
import Header from '$lib/components/Header.svelte';

let email = '';
    let password = '';
    let resetEmail = '';
    let showResetForm = false;
    let resetMessage = '';
    let errorMessage = '';


    async function handleLogin() {
      try {
        const data = await login(email, password);
        if (data && data.data && data.data.access_token) {
          authToken.set(data.data.access_token);
          const userData = await fetchProfile();
          user.set(userData);
          goto('/');
        } else {
          console.error('Login failed: No data received');
          errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
        }
      } catch (error) {
        console.error('Login failed:', error);
        errorMessage = 'Identifiant ou mot de passe incorrect.'; // Définir le message d'erreur
      }
    } 
</script>
<Header />
<main>
    <h1>Login</h1>
    <input bind:value={email} placeholder="Email" />
    <input type="password" bind:value={password} placeholder="Password" />
    <button on:click={handleLogin}>Login</button>
    
    {#if errorMessage}
  <p class="error">{errorMessage}</p>
  
{/if}
<a href="/new-password">Mot de passe oublié</a>

    </main>

    <style>
        main {
          width: 20%;
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
        a {
          color: #3acdde;
          text-decoration: none;
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
        .error {
          color: red;
          padding: 10px;
          text-align: center;
        }
      </style>