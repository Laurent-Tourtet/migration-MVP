<script>
    import { user } from '$lib/stores'; // Importer le store user
    import { fetchProfile } from '$lib/api'; // Importer la fonction fetchProfile

    const { subscribe } = user; // Souscrire au store user
    let userInfos; // Déclarer la variable userInfos
    async function loadProfile() {
        const data = await fetchProfile(); // Appeler la fonction fetchProfile
        userInfos = data.data; // Affecter les données reçues à userInfos
        console.log(userInfos);
    }

    loadProfile();
</script>
<main>
    <section>
<aside class="left-menu">
    <a href="/admin/profile">Profile</a>
    {#if userInfos}
<p>Hello {userInfos.first_name},</p>
<ul>
    <li>
        <p>Nom et Prénom:{userInfos.first_name}  {userInfos.last_name}</p> <!-- Vérifiez la bonne propriété -->
    </li>
    <li>
        <p>Email: {userInfos.email}</p> <!-- Vérifiez également ici -->
    </li>
    <li>
        <p>Il vous reste {userInfos.requests_limit - userInfos.requests_made} requêtes disponibles</p>
    </li>
</ul>
{:else}
<p>Chargement des informations ou utilisateur non authentifié.</p>
{/if}
    <a href="/new-password">Reset Password</a>
</aside>
</section>
</main>
<style>
     main {
        display: flex;
        justify-content: space-between;
        margin: 50px;
    }

    .left-menu {
        /* width: 20%; */
        border-radius: 5px;
        padding: 5px 0;
        background-color: #063b69;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px #333;
    }

    .left-menu a {
        font-size: 1.2rem;
        padding: 10px;
        color: #3acdde;
    }

    section {
        /* width: 70%; */
        padding: 20px;
        border-radius: 5px;
        background-color: #f4f4f4;
        box-shadow: 0 0 10px #333;
    }


</style>