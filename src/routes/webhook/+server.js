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
            const email = session.customer_details.email; 
            const subscriptionId = session.subscription;
            const fullName = session.customer_details.name; 
            const nameParts = fullName.split(' ');
        
            let firstName, lastName;
            if (nameParts.length > 1) {
                firstName = nameParts.slice(0, -1).join(' '); 
                lastName = nameParts[nameParts.length - 1]; 
            } else {
                firstName = fullName; 
                lastName = ''; 
            }
        
            // Définir la limite de requêtes en fonction du plan choisi
            let requestsLimit;
            const planId = session.metadata.plan_id;
        
            switch(planId) {
                case freePriceId:
                    requestsLimit = 1;
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
        
            try {
                console.log("Appel à la fonction createUser...");
                const newUser = await createUser(userData);
                console.log(`Utilisateur créé avec succès : ${newUser.id}`);
        
                if (newUser) {
                    await updateUser(newUser.id, { requests_made: 0 });
                    console.log('Initialisation de requests_made à 0 pour le nouvel utilisateur.');
        
                    console.log(`Tentative d'envoi d'un e-mail de réinitialisation à : ${newUser.email}`);
                    const result = await passwordReset(newUser.email);
                    console.log(`Réponse de l'API Directus pour l'email de réinitialisation :`, result);
                    console.log(`Email de réinitialisation envoyé à : ${newUser.email}`);
                }
            } catch (error) {
                console.error('Erreur lors de la création de l\'utilisateur ou de l\'envoi de l\'email:', error);
            }
        
            break;
        }
    } 
}       