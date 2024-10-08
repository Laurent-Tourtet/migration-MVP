<script>
    export let title = "Documentation de l'Application de Conversion SQL";
</script>

<main>
    <h1>{title}</h1>
    <a href="/">
        <i class="fas fa-angle-double-left"></i>
        <i class="fas fa-home"></i>
      </a>
    <section>
        <h2>1. Présentation de l'Application</h2>
        <p>
            Cette application permet de <strong>convertir des fichiers SQL</strong> à l'aide de l'API OpenAI.
            Les utilisateurs peuvent télécharger un fichier SQL via l'interface et obtenir un fichier converti après traitement.
            L'application offre également plusieurs plans d'abonnement, y compris un plan gratuit avec un nombre limité de conversions, ainsi que des plans payants pour les utilisateurs intensifs.
        </p>
    </section>

    <section>
        <h2>2. Fonctionnalités Principales</h2>
        <ul>
            <li><strong>Téléchargement de Fichiers SQL</strong> : Les utilisateurs peuvent télécharger des fichiers SQL pour traitement.</li>
            <li><strong>Stockage des Fichiers</strong> : Directus est utilisé pour gérer le stockage des fichiers téléchargés et convertis.</li>
            <li><strong>Conversion SQL</strong> : Utilisation de l'API OpenAI pour transformer et optimiser les requêtes SQL.</li>
            <li><strong>Abonnement Stripe</strong> : Gestion des paiements récurrents avec Stripe pour accéder à plus de conversions.</li>
        </ul>
    </section>

    <section>
        <h2>3. Gestion des Fichiers</h2>
        <p>
            Les fichiers téléchargés par les utilisateurs sont stockés dans la bibliothèque Directus et peuvent être consultés après conversion.
        </p>
    </section>

    <section>
        <h2>4. Plans d'Abonnement</h2>
        <p>
            Les plans d'abonnement sont disponibles via Stripe pour les utilisateurs souhaitant augmenter le nombre de conversions mensuelles :
        </p>
        <ul>
            <li><strong>Plan Gratuit</strong> : Jusqu'à 5 conversions par mois.</li>
            <li><strong>Plan Standard</strong> : 250 conversions par mois pour 10,99 € par mois.</li>
            <li><strong>Plan Illimité</strong> : Conversions illimitées pour 69,99 € par mois.</li>
        </ul>
    </section>

    <section>
        <h2>5. Instructions de Paiement avec Stripe</h2>
        <p>
            Une fois qu'un utilisateur choisit un plan d'abonnement, il est redirigé vers la page de paiement Stripe.
            Après validation, l'utilisateur reçoit une confirmation par email et peut accéder aux services supplémentaires.
        </p>
    </section>
</main>

<style>
    main {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
        font-family: Arial, sans-serif;
        line-height: 1.6;
    }

    h1, h2 {
        color: #007bff;
        text-align: center;
        margin-bottom: 30px;
    }

    ul {
        list-style: disc;
        margin-left: 20px;
    }

    p, ul {
        margin-bottom: 20px;
    }
    a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }
  i {
    margin-right: 5px; /* Ajustez l'espacement entre les icônes si nécessaire */
  }
</style>

