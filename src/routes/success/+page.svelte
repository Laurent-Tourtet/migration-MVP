<script>
    // Vous pouvez ajouter une logique pour féliciter l'utilisateur ou lui donner plus d'informations
  </script>
  
  <main>
    <h1>Merci pour votre achat !</h1>
    <p>Votre abonnement a été activé avec succès.</p>
    <p>Un <span>email</span> vous à été envoyé à l'adresse fournie lors du paiement afin de créer votre mot de passe,</p>
       <p><span>votre identifiant: votre adresse mail</span></p>
       <p>
        <a href="mailto:" id="access-mail">Accéder à vos mails</a>
      </p>
  </main>
  <style>
    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: #007bff;
     text-shadow: 2px 2px 4px #000000;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    span {
      color: #007bff;
      text-shadow: 2px 2px 4px #000000;
      font-weight: bold;
    }
    a {
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;
  }
  
  a:hover {
    text-decoration: none;
    color: #0056b3;
  }
  </style>
  