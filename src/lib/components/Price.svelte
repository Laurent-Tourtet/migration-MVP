<script>
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores';
  import { loadStripe } from '@stripe/stripe-js';

  let stripe;
  let email = ''; // Stocke l'email saisi par l'utilisateur

  const freePriceId = import.meta.env.VITE_PRICE_FREE;
  const standardPriceId = import.meta.env.VITE_PRICE_STANDARD;
  const unlimitedPriceId = import.meta.env.VITE_PRICE_UNLIMITED;

  const directusUrl = import.meta.env.VITE_DIRECTUS_URL; // URL de Directus
  const directusAdminToken = import.meta.env.VITE_DIRECTUS_ADMIN_TOKEN; // Token admin Directus

  // Chargement de Stripe avec la clé publique
  (async () => {
    stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  })();

  async function subscribe(planId) {
    try {
      const response = await fetch('/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
      }

      const { sessionId } = await response.json();

      if (sessionId) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Erreur lors de la redirection vers Stripe :', error);
        }
      } else {
        console.error('Erreur lors de la création de la session Stripe');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la session Stripe :', error);
    }
  }

  async function createDemoUser() {
    if (!email) {
      alert('Veuillez entrer une adresse email valide.');
      return;
    }

    // Génération d'un mot de passe aléatoire
    const password = generateRandomPassword();

    try {
      // Requête à l'API Directus pour créer un utilisateur
      const response = await fetch(`${directusUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${directusAdminToken}` // Utilisez le token admin
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: 'role_id_demo', // ID du rôle pour les utilisateurs démo
          status: 'active'
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Utilisateur démo créé avec succès. Vérifiez vos emails pour les identifiants.');

        // Appelez un endpoint pour envoyer les identifiants par email
        await sendDemoEmail(email, password);
      } else {
        console.error('Erreur lors de la création de l\'utilisateur Directus:', await response.text());
        alert('Une erreur est survenue lors de la création de l\'utilisateur.');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur Directus:', error);
    }
  }

  async function sendDemoEmail(email, password) {
    try {
      // Appel à un endpoint local pour envoyer l'email
      const response = await fetch('/api/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        console.log('Email envoyé avec succès.');
      } else {
        console.error('Erreur lors de l\'envoi de l\'email:', await response.text());
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
    }
  }

  function generateRandomPassword(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
</script>

{#if !$user}
<main class="pricing-container">
<!-- mode démo  -->
  <div class="pricing-card">
    <h2>Demo beta</h2>
    <h2>Demandez-nous les identifiants pour une demo</h2>
    <label for="email">Entrez votre email :</label>
    <input type="email" id="email" bind:value={email} placeholder="Votre email" required />
    <button class="price-btn" on:click={createDemoUser}>Je veux tester</button>
    <p class="price">Nous vous offrons <strong>3</strong> Requêtes gratuites</p><br>
    <!-- <p class="price">Essayez notre convertisseur gratuitement pour 3 requêtes.</p> -->
     
    
  <!-- </div>
   <div class="pricing-card">
    <h2>Demo</h2>
    <p><strong>10</strong> Requêtes gratuites</p><br>
    <p>Essayez notre convertisseur gratuitement pour 10 requêtes.</p>
    <p class="price">Gratuit</p>
    <button class="subscribe-btn" on:click={() => subscribe(freePriceId)}>Souscrire</button>
  </div> 

   <div class="pricing-card">
    <h2>Standard</h2>
    <p><strong>100</strong> requêtes par mois</p><br>
    <p>Adapté aux petits développeurs ou aux équipes avec des besoins modérés.</p>
    <p class="price">19,99 €/mois</p>
    <button class="subscribe-btn" on:click={() => subscribe(standardPriceId)}>Souscrire</button>
  </div>

  <div class="pricing-card">
    <h2>Unlimited</h2>
    <p><strong>Requêtes illimitées</strong></p><br>
    Pour les entreprises ou les développeurs ayant des besoins intensifs et réguliers
    <p class="price">69,99 €/mois</p>
    <button class="subscribe-btn" on:click={() => subscribe(unlimitedPriceId)}>Souscrire</button>
  </div> -->
</main>
{/if}

<style>
  /* Conteneur principal */
  .pricing-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 50px auto;
    padding: 20px;
    max-width: 1200px;
  }

  /* Style des cartes d'abonnement */
  .pricing-card {
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    padding: 20px;
    /* width: 30%; */
    width: 100%;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    cursor: pointer;
  }

  .pricing-card:hover {
    background-color: rgb(179, 176, 171);
    transform: translateY(-10px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  /* Titre des abonnements */
  .pricing-card h2 {
    font-size: 1.5rem;
    color: #007bff;
    margin-bottom: 10px;
  }

  /* Prix */
  .price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #c4c9cf;
    margin: 0;
  }
  .price-btn {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    margin: 20px 0;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }
  .price-btn:hover {
    background-color: #313d4a;
    box-shadow: 2px 4px 8px rgba(253, 251, 251, 0.959);
  }
  /* Bouton d'inscription */
  .subscribe-btn {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }

  .subscribe-btn:hover {
    background-color: #0056b3;
  }
</style>
