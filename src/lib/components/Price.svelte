<script>
    import { goto } from '$app/navigation';
import { user} from '$lib/stores';
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

   const { sessionId } = await response.json();

   if (sessionId) {
     goto(`https://checkout.stripe.com/pay/${sessionId}`);
   } else {
     console.error('Erreur lors de la création de la session Stripe');
   }
 }
</script>
{#if !$user}
    

<main class="pricing-container">
    <div class="pricing-card">
        <h2>Free</h2>
        <p><strong>5</strong> requêtes par mois</p><br>
        <p> Idéal pour les utilisateurs occasionnels ou ceux qui veulent essayer le service.</p>
        <p class="price">Gratuit</p>
        <button class="subscribe-btn" on:click={() => subscribe('price_1PtAGrRpckCWPiEzgF0BzBgi')}>Souscrire</button>
    </div>

    <div class="pricing-card">
        <h2>Standard</h2>
        <p><strong>250</strong> requêtes par mois</p><br>
        <p>Adapté aux petits développeurs ou aux équipes avec des besoins modérés.</p>
        <p class="price">10,99 €/mois</p>
        <button class="subscribe-btn" on:click={() => subscribe('price_1PtAJIRpckCWPiEzE0TiUnwG')}>Souscrire</button>
    </div>

    <div class="pricing-card">
        <h2>Unlimited</h2>
        <p><strong>Requêtes illimitées</strong></p><br>
    Pour les entreprises ou les développeurs ayant des besoins intensifs et réguliers
        <p class="price">69,99 €/mois</p>
        <button class="subscribe-btn" on:click={() => subscribe('price_1PtAK5RpckCWPiEzIqcCPaU1')}>Souscrire</button>
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
