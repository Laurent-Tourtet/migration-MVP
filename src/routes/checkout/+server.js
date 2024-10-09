import Stripe from 'stripe';
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY); // Remplacez par votre clé secrète

export async function POST({ request }) {
  const { planId, userId } = await request.json(); // Ajoute userId si tu veux l'utiliser

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: planId, // ID du plan Stripe
          quantity: 1,
        },
      ],
      success_url: 'https://sqlconverter.fr/success',
      cancel_url: 'https://sqlconverter.fr/cancel',
      metadata: {
        plan_id: planId, // Ajoute l'ID du plan aux métadonnées
        user_id: userId, // Ajoute l'ID de l'utilisateur si nécessaire
      }
    });

    return new Response(JSON.stringify({ sessionId: session.id }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Impossible de créer la session Stripe' }), { status: 500 });
  }
}

