import Stripe from 'stripe';
import { json } from '@sveltejs/kit';
import { createUser, passwordReset, updateUser } from "$lib/api"; // Assurez-vous que ces fonctions existent

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Assurez-vous que la variable d'environnement est définie
const freePriceId = process.env.PRICE_FREE;
const standardPriceId = process.env.PRICE_STANDARD;
const unlimitedPriceId = process.env.PRICE_UNLIMITED;

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
        case 'invoice.payment_succeeded': {
            const invoice = event.data.object;
            console.log('Payment succeeded:', invoice);
            break;
        }

        case 'checkout.session.completed': {
            const session = event.data.object;
            const email = session.customer_details.email; // Utiliser customer_details pour récupérer l'email
            const subscriptionId = session.subscription;
            const fullName = session.customer_details.name; // Récupérez le nom complet
            const nameParts = fullName.split(' ');
            console.log('Stripe checkout session completed event received');
            // Assurez-vous d'avoir au moins un prénom et un nom
            let firstName, lastName;
            if (nameParts.length > 1) {
                firstName = nameParts.slice(0, -1).join(' '); // Prénom : tout sauf le dernier mot
                lastName = nameParts[nameParts.length - 1]; // Nom : dernier mot
            } else {
                firstName = fullName; // Si c'est juste un mot, on l'utilise comme prénom
                lastName = ''; // Pas de nom de famille
            }

            // Définir la limite de requêtes en fonction du plan choisi
            let requestsLimit;
            const planId = session.metadata.plan_id; // Assurez-vous d'envoyer ce metadata lors de la création de la session
            
            switch(planId) {
                case freePriceId: // Remplace par l'ID réel du plan gratuit dans Stripe
                    requestsLimit = 1; // Par exemple, 10 requêtes pour le plan gratuit
                    break;
                case standardPriceId: // Remplace par l'ID réel du plan standard dans Stripe
                    requestsLimit = 100; // Par exemple, 100 requêtes pour le plan standard
                    break;
                case unlimitedPriceId: // Remplace par l'ID réel du plan unlimited dans Stripe
                    requestsLimit = 0; // 0 signifie aucune limite
                    break;
                default:
                    requestsLimit = 10; // Par défaut, mettre une limite raisonnable si non spécifié
            }

            // Créer l'utilisateur dans Directus avec la limite de requêtes
            const userData = {
                email: email,
                first_name: firstName,
                last_name: lastName,
                subscription_id: subscriptionId,
                requests_limit: requestsLimit // Limite de requêtes en fonction du plan
            };
                console.log(userData);
            try {
                const newUser = await createUser(userData);
                console.log(`Utilisateur créé avec succès : ${newUser.id}`);
            
                if (newUser) {
                    await updateUser(newUser.id, { requests_made: 0 });
                    console.log('Initialisation de requests_made à 0 pour le nouvel utilisateur.');
            
                    // Log avant d'envoyer l'email
                    console.log(`Tentative d'envoi d'un e-mail de réinitialisation à : ${newUser.email}`);
                    await passwordReset(newUser.email);
                    console.log(`Email de réinitialisation envoyé à : ${newUser.email}`);
                }
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
