<script>
    import { onMount } from 'svelte';
    import { user } from '$lib/stores';

    onMount(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            console.log('Utilisateur stocké dans localStorage:', JSON.parse(storedUser));
        }
    });
</script>

<main>
    {#if $user && $user.firstname}
        <p class="paragraph"><strong>Hello {$user.firstname},<br>
            télécharge un fichier postgres avec une extension .sql 
            et clique sur convertir pour obtenir ta requête postgres convertie en MySQL</strong></p>
    {/if}
</main>

<style>
    .paragraph {
        width: 70%;
        margin: 20px auto 0 auto;
        text-align: center;
        padding: 20px;
        font-size: 1.2rem;
        color: #063b69;
        text-shadow: 2px 2px 4px #f8f5f5;
    }
</style>
