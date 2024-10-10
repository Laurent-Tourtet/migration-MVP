<script>
import { user } from '$lib/stores';
</script>

<main>
    <nav>
      <a href="/">
        <i class="fas fa-home"></i>
        <p>Home</p>
      </a>
      {#if !$user}
        <a href="/login">
          <i class="fas fa-sign-in-alt"></i>
          <p>Login</p>
        </a>
      {/if}
      {#if $user}
        <a href="/admin/profile">
          <i class="fas fa-user"></i>
          <p>Profile</p>
        </a>
        <a href="/logout" on:click={(e) => { 
          e.preventDefault(); 
          user.set(null); 
        }}>
          <i class="fas fa-sign-out-alt"></i>
          <p>Logout</p>
        </a>
      {/if}
         <a href="/doc">
            <i class="fas fa-book"></i>
            <p>Doc</p>
          </a>
      </nav>
</main>

<style>
    main {
        width: 20%;
        border-radius: 5px;
        padding: 5px 0;
        background-color: #063b69; 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 80px auto 0 auto;
        box-shadow: 0 0 10px #333;
    }

    nav {
        display: flex;
        justify-content: space-around;
        width: 100%;
    }

    a {
        font-size: 1.2rem;
        padding: 10px;
        color: #3acdde;
        text-decoration: none;
    }
    a:hover {
        color: #e1e6eb;
        text-decoration: underline;
    }
</style>