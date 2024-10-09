<script>
    import { isMaintenanceMode } from '$lib/stores';

    // Fonction pour basculer le mode maintenance
    function toggleMaintenance() {
        isMaintenanceMode.update(current => {
            console.log("Ancien mode maintenance :", current);  // Debug
            const newMode = !current;
            console.log("Nouveau mode maintenance :", newMode);  // Debug
            return newMode;
        });
    }
</script>

<main>
    <button on:click={toggleMaintenance}>
        {#if $isMaintenanceMode}
            Désactiver le mode maintenance
        {:else}
            Activer le mode maintenance
        {/if}
    </button>

    {#if $isMaintenanceMode}
        <p>Le site est actuellement en mode maintenance.</p>
    {/if}
</main>
