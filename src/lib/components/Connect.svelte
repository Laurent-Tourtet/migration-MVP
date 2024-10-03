<script>
    import { user } from '$lib/stores';
    </script>
    
    <main>
        
        {#if $user}
            <p class="paragraph"><strong>Hello {$user.first_name},<br>
                 télécharge un fichier postgres avec une extension .sql 
                 et clique sur convertir pour obtenir ta requête postgres convertie en MySQL</strong> </p>
            
        {/if}
        
    
    </main>
    <style>
       
        .paragraph {
            width: 70%;
            background-color: rgb(105, 112, 118);
            margin: 20px auto 0 auto;
            text-align: center;
            border-radius: 5px;
            padding: 20px;
            font-size: 1.2rem;
            color: #101111;
     text-shadow: 2px 2px 4px #e7dada;
     box-shadow: 1px 0 5px #333;
        }
        
        
       
    </style>