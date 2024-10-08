import Stripe from 'stripe';
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY); // Remplacez par votre clé secrète

export async function POST({ request }) {
  const { planId } = await request.json();
  
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
      success_url: 'https://sqlconverter.fr/success', // URL en cas de succès
      cancel_url: 'https://sqlconverter.fr/cancel', // URL en cas d'annulation
    });

    return new Response(JSON.stringify({ sessionId: session.id }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Impossible de créer la session Stripe' }), { status: 500 });
  }
}
