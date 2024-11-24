<script>
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores';
  import { loadStripe } from '@stripe/stripe-js';

  let stripe;
  let email = ''; // Stocke l'email saisi par l'utilisateur

  const freePriceId = import.meta.env.VITE_PRICE_FREE;
  const standardPriceId = import.meta.env.VITE_PRICE_STANDARD;
  const unlimitedPriceId = import.meta.env.VITE_PRICE_UNLIMITED;

  // Chargement de Stripe avec la clé publique
  (async () => {
    stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  })();

  function handleSignupClick() {
    goto('/login');
  }

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

  function sendDemoEmail() {
    if (!email) {
      alert('Veuillez entrer une adresse email valide.');
      return;
    }

    const subject = encodeURIComponent('Demande de demo beta');
    const body = encodeURIComponent(`Bonjour,Veuillez me fournir les identifiants pour une démo beta. Email : ${email}`);
    const mailtoLink = `mailto:contact@yautedev.fr?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
  }
</script>

{#if !$user}
<main class="pricing-container">
  <div class="pricing-card">
    <h2>Demo beta</h2>
    <h2>Demandez-nous les identifiants pour une demo par mail</h2>
    <label for="email">Entrez votre email :</label>
    <input type="email" id="email" bind:value={email} placeholder="Votre email" required />
    <button class="price-btn" on:click={sendDemoEmail}>Je veux tester</button>
    <p class="price">Nous vous offrons <strong>3</strong> Requêtes gratuites</p><br>
  </div>
</main>
{/if}

<style>
  /* Conteneur principal */
  .pricing-container {
    display: flex;
    justify-content: center;
    align-items: center;
    /* margin-top: 50px; */
    padding: 20px;
    max-width: 800px;
  }

  /* Style des cartes */
  .pricing-card {
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    padding: 20px;
    width: 100%;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }

  .pricing-card:hover {
    background-color: rgb(179, 176, 171);
    transform: translateY(-10px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  /* Champs et boutons */
  input[type="email"] {
    padding: 10px;
    font-size: 1rem;
    width: 80%;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
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
  }
</style>
