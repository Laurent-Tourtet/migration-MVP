<script>
    import Header from '$lib/components/Header.svelte';
    import ProfileInfos from '$lib/components/ProfileInfos.svelte';

</script>

<Header />
<main>
    <ProfileInfos />
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