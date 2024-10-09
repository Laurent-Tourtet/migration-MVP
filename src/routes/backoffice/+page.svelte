<script>
    import { isMaintenanceMode } from '$lib/stores'; // Assurez-vous d'importer le store ici

    function toggleMaintenance() {
        // Mettez à jour l'état du mode maintenance
        isMaintenanceMode.update(current => {
            const newValue = !current; // Inverser la valeur actuelle
            console.log('Nouveau mode maintenance :', newValue); // Log de la nouvelle valeur
            return newValue; // Retourner la nouvelle valeur pour mettre à jour le store
        });
    }
</script>

<button on:click={toggleMaintenance}>
    {#if $isMaintenanceMode}
        Désactiver le mode maintenance
    {:else}
        Activer le mode maintenance
    {/if}
</button>
