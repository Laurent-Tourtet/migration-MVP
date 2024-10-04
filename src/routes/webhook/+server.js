import Stripe from 'stripe';
import { json } from '@sveltejs/kit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Assurez-vous que la variable d'environnement est définie

export async function POST({ request }) {
    const sig = request.headers.get('stripe-signature');
    const body = await request.text();

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET); // Modifié ici
    } catch (err) {
        console.error('Webhook error:', err.message);
        return json({ error: 'Webhook error: ' + err.message }, { status: 400 });
    }

    // Gérer l'événement ici
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            // Traitez l'abonnement ici (enregistrer dans votre base de données, etc.)
            console.log(`Session ${session.id} was successful!`);
            break;
        case 'invoice.payment_failed':
            const invoice = event.data.object;
            // Gérez les paiements échoués ici
            console.error(`Payment failed for invoice ${invoice.id}`);
            break;
        // Ajoutez d'autres événements si nécessaire
        default:
            console.warn(`Unhandled event type ${event.type}`);
    }

    return json({ received: true });
}
