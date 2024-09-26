<script>
    import { createUser } from "$lib/api";
    import { onMount } from 'svelte';
    import Header from '$lib/components/Header.svelte';
    import { goto } from '$app/navigation';
   let firstname = "";
   let lastname = "";
   let location = "";
   let email = "";
   let password = "";
   let confirmPassword = "";
   let errorMessage = "";
   let succesMessage = "";

   async function registerUser() {
     if (password !== confirmPassword) {
       errorMessage = 'Les mot de passe ne correspondent pas !';
       return;
     }

     if(!email.includes('@')) {
       errorMessage = 'Email invalide';
       return;
     }
     if (password.length < 8) {
       errorMessage = 'Le mot de passe doit contenir au moins 8 caractères';
       return;
     }

     try {
       const data = {
         first_name: firstname,
         last_name: lastname,
         location,
         email,
         password,
       };
       const response = await createUser(data);

       console.log('Réponse de l\'API:', response);

       if(response && response.data) {
         succesMessage = " inscription réussie!";
         goto('/login');
       } else {
         errorMessage = "Erreur lors de l'inscription";
       }
       } catch (error){
         errorMessage = "Error: " + error.message
       }
     }

 </script>
 <Header />
 <main>
 <h1>Register</h1>
 <form class="flex-register" on:submit|preventDefault={registerUser}>
   <article>
   <label for="firstname">Prénom</label>
   <input bind:value={firstname} placeholder="Prénom" />

   <label for="lastname">Nom</label>
   <input bind:value={lastname} placeholder="Nom" />

   <label for="location">Adresse</label>
   <input bind:value={location} placeholder="Adresse" />
 </article>
 <article>
   <label for="email">Email</label>
 <input bind:value={email} placeholder="Email" />

 <label for="password">Mot de passe</label>
 <input type="password" bind:value={password} placeholder="Password" />

 <label for="passwordConfirm">Confirmer mot de passe</label>
 <input type="password" bind:value={confirmPassword} placeholder="Password Confirmation" />
</article>
<article>
<button type="submit">Register</button>
</article>
</form>
 
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
   margin: 50px auto 0 auto;
   box-shadow: 0 0 10px #333;
 }
 form {
   display: flex;
   
   justify-content: space-around;
   width: 100%;
 }
 .flex-register{
   display: flex;
   justify-content: space-around;
   width: 100%;
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
   background-color: #0ec874;
   box-shadow: inset 0 0 10px #333;
 }

 button {
   width: 150px;
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
 label {
   color: #3acdde;
   font-weight: bold;
   font-size: 0.8em;
 }
</style>