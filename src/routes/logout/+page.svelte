<script context="module">
    // Pré-rendu de la page pour effectuer la déconnexion dès que l'utilisateur accède à cette route
    export async function load({ session }) {
      session.token = null;
      return {
        status: 302,
        redirect: '/'
      };
    }
  </script>