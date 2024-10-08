import Stripe from 'stripe';
import { json } from '@sveltejs/kit';
import { createUser, passwordReset } from "$lib/api"; // Assurez-vous que ces fonctions existent

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Assurez-vous que la variable d'environnement est définie

export async function POST({ request }) {
    const sig = request.headers.get('stripe-signature');
    const body = await request.text();

    let event;

    try {
        // Construire l'événement Stripe à partir de la signature et du corps de la requête
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook error:', err.message);
        return json({ error: 'Webhook error: ' + err.message }, { status: 400 });
    }

    // Log de l'événement pour le débogage
    console.log('Received webhook:', event);

    // Gérer l'événement ici
    switch (event.type) {
        case 'invoice.payment_succeeded':
            const invoice = event.data.object;
            // Gère la réussite du paiement
            console.log('Payment succeeded:', invoice);
            break;

        case 'checkout.session.completed': {
            const session = event.data.object;
            const email = session.customer_details.email; // Utiliser customer_details pour récupérer l'email
            const subscriptionId = session.subscription;
            const subscriptionStatus = 'active';
            const fullName = session.customer_details.name; // Récupérez le nom complet
            const nameParts = fullName.split(' ');
            
            // Assurez-vous d'avoir au moins un prénom et un nom
            let firstName, lastName;
            if (nameParts.length > 1) {
                firstName = nameParts.slice(0, -1).join(' '); // Prénom : tout sauf le dernier mot
                lastName = nameParts[nameParts.length - 1]; // Nom : dernier mot
            } else {
                firstName = fullName; // Si c'est juste un mot, on l'utilise comme prénom
                lastName = ''; // Pas de nom de famille
            }
            
            // Créer l'utilisateur dans Directus
            const userData = {
                email: email,
                first_name: firstName,
                last_name: lastName,
                subscription_id: subscriptionId,
                subscription_status: subscriptionStatus,
            };
            

            try {
                const newUser = await createUser(userData);
                console.log(`Utilisateur créé avec succès : ${newUser.id}`);

                // Envoyer un email pour réinitialiser le mot de passe
                await passwordReset(email);
                console.log(`Email de réinitialisation envoyé à : ${email}`);

            } catch (error) {
                console.error('Erreur lors de la création de l\'utilisateur:', error);
            }

            break;
        }
        default:
            console.warn(`Type d'événement non géré : ${event.type}`);
    }

    return json({ received: true });
}
