import Stripe from 'stripe';
import { createUser, passwordReset, updateUser } from "$lib/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const freePriceId = process.env.PRICE_FREE;
const standardPriceId = process.env.PRICE_STANDARD;
const unlimitedPriceId = process.env.PRICE_UNLIMITED;

export async function POST({ request }) {
    console.log("Webhook POST reçu");

    const sig = request.headers.get('stripe-signature');
    const body = await request.text();
    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook error:', err.message);
        return new Response(JSON.stringify({ error: 'Webhook error: ' + err.message }), { status: 400 });
    }

    console.log('Received webhook:', event);

    try {
        switch (event.type) {
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                console.log('Payment succeeded:', invoice);
                return new Response(JSON.stringify({ message: 'Invoice payment succeeded' }), { status: 200 });
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
                console.log("userData", userData);

                console.log("Appel à la fonction createUser...");
                
                const existingUserResponse = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/users?filter[email][_eq]=${userData.email}`);
                const existingUserData = await existingUserResponse.json();

                if (existingUserData && existingUserData.data && existingUserData.data.length > 0) {
                    console.log("Utilisateur déjà existant avec cet email.");
                    return new Response(JSON.stringify({ message: "Utilisateur déjà existant" }), { status: 200 });
                }

                const newUser = await createUser(userData);
                console.log(`Utilisateur créé avec succès : ${newUser?.id}`);

                if (newUser && newUser.id) {
                    await updateUser(newUser.id, { requests_made: 0 });
                    console.log('Initialisation de requests_made à 0 pour le nouvel utilisateur.');

                    console.log(`Tentative d'envoi d'un e-mail de réinitialisation à : ${userData.email}`);
                    const result = await passwordReset(userData.email);
                    console.log(`Réponse de l'API Directus pour l'email de réinitialisation :`, result);
                    console.log(`Email de réinitialisation envoyé à : ${userData.email}`);
                }

                return new Response(JSON.stringify({ message: "Utilisateur créé et email envoyé" }), { status: 200 });
            }

            default:
                console.log(`Webhook non géré: ${event.type}`);
                return new Response(JSON.stringify({ message: `Unhandled event type: ${event.type}` }), { status: 200 });
        }
    } catch (error) {
        console.error("Erreur lors du traitement du webhook :", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
