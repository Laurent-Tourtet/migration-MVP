import Stripe from 'stripe';
import { createUser, updateUser, passwordReset } from "$lib/api";

// Initialisation de Stripe avec votre clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Définition des prix par ID
const freePriceId = process.env.PRICE_FREE;
const standardPriceId = process.env.PRICE_STANDARD;
const unlimitedPriceId = process.env.PRICE_UNLIMITED;

export async function POST({ request }) {
    const token = process.env.DIRECTUS_ADMIN_TOKEN; // Utilisation de la variable d'environnement

    console.log("Webhook POST reçu");

    const sig = request.headers.get('stripe-signature');
    const body = await request.text();
    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Erreur de validation du webhook Stripe:', err.message);
        return new Response(JSON.stringify({ error: 'Erreur de validation du webhook Stripe : ' + err.message }), { status: 400 });
    }

    console.log('Webhook Stripe reçu:', event);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const email = session.customer_details.email;
                const subscriptionId = session.subscription;
                const fullName = session.customer_details.name || "";
                const nameParts = fullName.split(' ');

                const firstName = nameParts.slice(0, -1).join(' ');
                const lastName = nameParts[nameParts.length - 1] || "";

                let requestsLimit;
                const planId = session.metadata.plan_id;

                switch (planId) {
                    case freePriceId:
                        requestsLimit = 3;
                        break;
                    case standardPriceId:
                        requestsLimit = 100;
                        break;
                    case unlimitedPriceId:
                        requestsLimit = 0;
                        break;
                    default:
                        requestsLimit = 10;
                }

                const userData = {
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    subscription_id: subscriptionId,
                    requests_limit: requestsLimit
                };
                console.log("Données de l'utilisateur à créer:", userData);

                // Création de l'utilisateur avec un mot de passe généré
                const newUser = await createUser(userData);
                console.log("Réponse de la création d'utilisateur:", newUser);

                if (newUser?.data?.id) {
                    const userId = newUser.data.id;
                    console.log(`ID de l'utilisateur créé: ${userId}`);

                    // Mise à jour de l'utilisateur avec le token admin
                    const updateResponse = await updateUser(userId, { requests_made: 0, requests_limit: requestsLimit }, token);
                    console.log("Réponse de la mise à jour de l'utilisateur:", updateResponse);
                    console.log(`Initialisation de requests_made à 0 pour l'utilisateur ID ${userId}`);

                    // Appel à la fonction passwordReset pour envoyer l'email de réinitialisation de mot de passe
                    await passwordReset(email);
                    console.log(`Email de réinitialisation envoyé à : ${email}`);

                    // Incrémentez requests_made pour l'utilisateur
                    await updateUser(userId, { requests_made: 1 }, token);
                    console.log(`Incrémentation de requests_made pour l'utilisateur ID ${userId}`);
                } else {
                    console.error("Échec de la création de l'utilisateur: ID utilisateur non reçu.");
                }

                return new Response(JSON.stringify({ message: "Utilisateur créé avec mot de passe généré et email de réinitialisation envoyé" }), { status: 200 });
            }

            default:
                console.log(`Type d'événement non géré : ${event.type}`);
                return new Response(JSON.stringify({ message: `Type d'événement non géré : ${event.type}` }), { status: 200 });
        }
    } catch (error) {
        console.error("Erreur lors du traitement du webhook:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
