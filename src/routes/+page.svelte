<script>
    import { user} from '$lib/stores';
    import Header from '$lib/components/Header.svelte';
    import Connect from '$lib/components/Connect.svelte';
    import UploadForm from '$lib/components/UploadForm.svelte';
    import Price from '$lib/components/Price.svelte';
    import Footer from '../lib/components/Footer.svelte';
</script>
<main>
    <Header />
<h1>Converter PostgreSQL to MySQL</h1>

<Connect />
{#if !$user}
<Price />
{/if}
{#if $user}
<UploadForm />
{/if}
</main>
<Footer />
<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /* margin-top: 50px; */
        background-color: rgb(175, 176, 176);
    }

    h1 {
      margin-top: 60px;
     color: #007bff;
     text-shadow: 2px 2px 4px #000000;
    }
</style>