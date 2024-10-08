<script>
    export let year = new Date().getFullYear();
</script>

<footer class="footer-container">
    <div class="footer-content">
        <div class="footer-links">
            <a href="/cgv">Conditions Générales de Vente (CGV)</a> |
            <a href="/mention">Mentions Légales</a> |
            <a href="/contact">Contact</a>
        </div>

        <div class="footer-social">
            <a href="https://x.com/YauteDev" target="_blank" rel="noopener noreferrer">
                <img src="/icons/twitter.svg" alt="Twitter" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61557364854477" target="_blank" rel="noopener noreferrer">
                <img src="/icons/facebook.svg" alt="Facebook" />
            </a>
            <a href="https://www.linkedin.com/in/tourtet-laurent/" target="_blank" rel="noopener noreferrer">
                <img src="/icons/linkedin.svg" alt="LinkedIn" />
            </a>
        </div>

        <p>&copy; {year} SQL Converter. Tous droits réservés.</p>
    </div>
</footer>

<style>
    .footer-container {
        background-color: #2d2d2d;
        color: #fff;
        padding: 20px 0;
        text-align: center;
    }

    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .footer-links a {
        color: #fff;
        text-decoration: none;
        margin: 0 10px;
    }

    .footer-links a:hover {
        text-decoration: underline;
    }

    .footer-social {
        margin: 15px 0;
    }

    .footer-social a {
        margin: 0 10px;
    }

    .footer-social img {
        width: 24px;
        height: 24px;
    }

    p {
        margin: 0;
        font-size: 0.9rem;
    }
</style>

