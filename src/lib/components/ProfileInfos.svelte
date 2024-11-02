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