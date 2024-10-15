<script>
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores';
  import { loadStripe } from '@stripe/stripe-js';

  let stripe;

  // Chargement de Stripe avec la clé publique
  (async () => {
    stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  })();

  function handleSignupClick() {
    goto('/login');
  }

  async function subscribe(planId) {
    const response = await fetch('/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId })
    });

    // const { sessionId } = await response.json();
    // if (error) {
    //     console.error('Erreur lors de la création de la session Stripe :', error);
    //     return;
    //   }

    if (sessionId) {
      // Redirection vers Stripe avec la méthode recommandée
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Erreur lors de la redirection vers Stripe :', error);
      }
    } else {
      console.error('Erreur lors de la création de la session Stripe');
    }
  }
</script>

{#if !$user}
<main class="pricing-container">
  <div class="pricing-card">
    <h2>Demo</h2>
    <p><strong>10</strong> Requêtes gratuites</p><br>
    <p>Essayez notre convertisseur gratuitement pour 10 requêtes.</p>
    <p class="price">Gratuit</p>
    <button class="subscribe-btn" on:click={() => subscribe('price_1QA4zWRpckCWPiEzX2HaQBG8')}>Souscrire</button>
  </div>

  <div class="pricing-card">
    <h2>Standard</h2>
    <p><strong>100</strong> requêtes par mois</p><br>
    <p>Adapté aux petits développeurs ou aux équipes avec des besoins modérés.</p>
    <p class="price">19,99 €/mois</p>
    <button class="subscribe-btn" on:click={() => subscribe('price_1QA5HwRpckCWPiEzO9tkixKs')}>Souscrire</button>
  </div>

  <div class="pricing-card">
    <h2>Unlimited</h2>
    <p><strong>Requêtes illimitées</strong></p><br>
    Pour les entreprises ou les développeurs ayant des besoins intensifs et réguliers
    <p class="price">69,99 €/mois</p>
    <button class="subscribe-btn" on:click={() => subscribe('price_1QA5I2RpckCWPiEzVL9sUTUp')}>Souscrire</button>
  </div>
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
    width: 30%;
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
    font-size: 2rem;
    font-weight: bold;
    color: #343a40;
    margin: 20px 0;
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
