<script>
    import { passwordReset } from '$lib/api';
  
    let email = '';
    let message = '';
  
    async function handlePasswordReset() {
      try {
        await passwordReset(email);
        message = 'Un email de réinitialisation a été envoyé à votre adresse.';
      } catch (error) {
        message = `Erreur: ${error.message}`;
      }
    }
  </script>
  
  <main>
    <p>Réinitialisation du mot de passe</p>
    <input type="email" bind:value={email} placeholder="Entrez votre email" required />
    <button on:click={handlePasswordReset}>Envoyer</button>
    {#if message}
      <p>{message}</p>
    {/if}
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
      text-align: center;
    }
  </style>
  