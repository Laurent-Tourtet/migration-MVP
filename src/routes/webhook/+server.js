import Stripe from 'stripe';
import { createUser, updateUser } from "$lib/api";
import { getStoredToken } from '../../lib/api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const freePriceId = process.env.PRICE_FREE;
const standardPriceId = process.env.PRICE_STANDARD;
const unlimitedPriceId = process.env.PRICE_UNLIMITED;

export async function POST({ request }) {
    const token = getStoredToken();
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
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                console.log('Paiement réussi pour l\'invoice:', invoice);
                return new Response(JSON.stringify({ message: 'Paiement de l\'invoice réussi' }), { status: 200 });
            }

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
                        requestsLimit = 10;
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
                    
                    // Mise à jour de l'utilisateur sans redéfinir `updateUser`
                    const updateResponse = await updateUser(userId, { requests_made: 0, requests_limit: requestsLimit }, token);
                    console.log("Réponse de la mise à jour de l'utilisateur:", updateResponse);
                    console.log(`Initialisation de requests_made à 0 pour l'utilisateur ID ${userId}`);
                    console.log(`Mot de passe pour ${userData.email} : ${newUser.data.password}`);
                } else {
                    console.error("Échec de la création de l'utilisateur: ID utilisateur non reçu.");
                }

                return new Response(JSON.stringify({ message: "Utilisateur créé avec mot de passe généré" }), { status: 200 });
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
