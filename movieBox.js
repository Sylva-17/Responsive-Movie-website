
    //   swiper
      var swiper = new Swiper('.home', {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        loop:true,
      });
    //swiper

    const API_KEY = "23807b5cfafe878f24815a64fdae12da"
    const URL_MOVIES = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&language=fr-FR`;


    const moviesContainer = document.querySelector('.movies-container');

async function chargerFilmsTMDb() {
    try {
        const response = await fetch(URL_MOVIES);
        const data = await response.json();
        console.log("contenu: " ,data)
        // Vider la grille statique pour la remplacer par les films de l'API
        moviesContainer.innerHTML = '';

        data.results.forEach(movie => {
            if (!movie.poster_path) return;

            const box = document.createElement('div');
            box.classList.add('box');

            box.innerHTML = `
                <div class="box-img">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                </div>
                <h3>${movie.title}</h3>
                <span>⭐ ${movie.vote_average.toFixed(1)} | ${movie.release_date ? movie.release_date.split('-')[0] : 'Film'}</span>
            `;

            // Événement au clic : ouvrir le lecteur CinePro avec l'ID TMDb du film
            box.addEventListener('click', () => {
                ouvrirLecteurCinePro(movie.id, movie.title);
            });

            moviesContainer.appendChild(box);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des films TMDb :", error);
    }
}

// Lancer la fonction au chargement
chargerFilmsTMDb();

// ==========================================
// 3. OUVERTURE DU LECTEUR VIDÉO (CINEPRO)
// ==========================================
function ouvrirLecteurCinePro(tmdbId, titre) {
    // Création d'une fenêtre modale par-dessus le site
    const modal = document.createElement('div');
    modal.classList.add('video-modal');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.95);
        z-index: 10000000000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;

    modal.innerHTML = `
        <div style="width: 100%; max-width: 900px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="color: white; font-size: 1.3rem; font-family: 'Poppins', sans-serif;">${titre}</h2>
            <button id="fermer-modal" style="background: #ff2c1f; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 1rem;">Fermer ✕</button>
        </div>
        <div style="width: 100%; max-width: 900px; height: 500px; background: #000; border-radius: 8px; overflow: hidden;">
            <!-- Remplace l'URL par le format exact de l'iframe CinePro -->
            <iframe src="https://api.codespecters.com/embed/movie/${tmdbId}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
        </div>
    `;

    document.body.appendChild(modal);

    // Bouton pour fermer la modale et couper la vidéo
    document.getElementById('fermer-modal').addEventListener('click', () => {
        modal.remove();
    });
}
