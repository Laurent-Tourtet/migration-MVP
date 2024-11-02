<script>
    import { user } from '$lib/stores'; // Importer le store user
    import { fetchProfile } from '$lib/api'; // Importer la fonction fetchProfile
    // import { onMount } from 'svelte';
    import Header from '$lib/components/Header.svelte';
    import ProfileInfos from '$lib/components/ProfileInfos.svelte';

    // onMount(() => {
    //     if (typeof window !== 'undefined') {
    //         const storedUser = localStorage.getItem('user');
    //         console.log('Utilisateur stocké dans localStorage:', JSON.parse(storedUser));
    //     }
    // });
    const { subscribe } = user; // Souscrire au store user
    let userInfos; // Déclarer la variable userInfos
    async function loadProfile() {
        const data = await fetchProfile(); // Appeler la fonction fetchProfile
        userInfos = data.data; // Affecter les données reçues à userInfos
        console.log(userInfos);
    }

    loadProfile();

</script>
<Header />
<main>
    <ProfileInfos {userInfos} />
<section>
    <h1>Profile</h1>
    
    <p>Welcome to your profile page.</p>
    <p>Here you can update your personal information.</p>
    <p>For security reasons, you can't change your email address.</p>
    <p>If you need to change your email address, please contact support: <a href="mailto:">contact@yautedev.fr</a></p>
    <p>Thank you for using our service.</p>
</section>
</main>
<style>
    main {
        display: flex;
        justify-content: space-between;
        margin: 50px;
    }

    .left-menu {
        width: 20%;
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
        width: 70%;
        padding: 20px;
        border-radius: 5px;
        background-color: #f4f4f4;
        box-shadow: 0 0 10px #333;
    }
    h1 {
        color: #3acdde;
        padding-bottom: 10px;
        text-align: center;
    }
</style>