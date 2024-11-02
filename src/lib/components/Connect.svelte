<script>
    import { user } from '$lib/stores';
    const storedUser = localStorage.getItem('user');
console.log('Utilisateur stocké dans localStorage:', JSON.parse(storedUser));

    </script>
    
    <main>
        
        {#if $user & $user.firstname}
            <p class="paragraph"><strong>Hello {$user.firstname},<br>
                 télécharge un fichier postgres avec une extension .sql 
                 et clique sur convertir pour obtenir ta requête postgres convertie en MySQL</strong> </p>
            
        {/if}
        
    
    </main>
    <style>
       
        .paragraph {
            width: 70%;
            /* background-color: rgb(105, 112, 118); */
            margin: 20px auto 0 auto;
            text-align: center;
            /* border-radius: 5px; */
            padding: 20px;
            font-size: 1.2rem;
            color: #063b69;
     text-shadow: 2px 2px 4px #f8f5f5;
     /* box-shadow: 1px 0 5px #333; */
        }
        
        
       
    </style>