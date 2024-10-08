<script>
    export let title = "Conditions Générales de Vente";
</script>

<main>
    <h1>{title}</h1>

    <section>
        <h2>1. Objet</h2>
        <p>
            Les présentes conditions générales de vente (CGV) régissent l'ensemble des transactions réalisées via notre plateforme de conversion SQL.
            Elles précisent les droits et obligations des parties concernant l'utilisation de notre service et l'achat des abonnements proposés.
        </p>
    </section>

    <section>
        <h2>2. Services Proposés</h2>
        <p>
            La plateforme offre un service de conversion de fichiers SQL grâce à l'API OpenAI. Les utilisateurs peuvent souscrire à différents plans 
            d'abonnement pour accéder à un nombre déterminé de conversions.
        </p>
    </section>

    <section>
        <h2>3. Abonnements et Tarifs</h2>
        <p>
            Les abonnements disponibles sont les suivants :
        </p>
        <ul>
            <li><strong>Plan Gratuit</strong> : 5 conversions par mois, gratuit.</li>
            <li><strong>Plan Standard</strong> : 250 conversions par mois pour 10,99 € par mois.</li>
            <li><strong>Plan Illimité</strong> : Conversions illimitées pour 69,99 € par mois.</li>
        </ul>
    </section>

    <section>
        <h2>4. Paiement</h2>
        <p>
            Le paiement des abonnements est réalisé via la plateforme Stripe, qui garantit la sécurité des transactions. Le paiement est récurrent et
            peut être annulé à tout moment par l'utilisateur.
        </p>
    </section>

    <section>
        <h2>5. Droit de Rétractation</h2>
        <p>
            Conformément à la loi, les utilisateurs disposent d'un délai de rétractation de 14 jours après souscription. Toutefois, ce droit ne s'applique pas
            une fois le service de conversion utilisé.
        </p>
    </section>

    <section>
        <h2>6. Limitation de Responsabilité</h2>
        <p>
            La plateforme ne pourra être tenue responsable des dommages directs ou indirects liés à l'utilisation du service, notamment en cas d'erreurs
            dans les fichiers convertis ou d'interruptions de service.
        </p>
    </section>

    <section>
        <h2>7. Modification des CGV</h2>
        <p>
            Nous nous réservons le droit de modifier les présentes CGV à tout moment. Les utilisateurs seront informés des modifications via leur compte ou par e-mail.
        </p>
    </section>
</main>

<style>
    main {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
        font-family: Arial, sans-serif;
    }

    h1, h2 {
        color: #007bff;
    }

    p, ul {
        margin-bottom: 20px;
    }

    ul {
        list-style: disc;
        margin-left: 20px;
    }
</style>
