document.addEventListener('DOMContentLoaded', () => {
    const pokemonList = document.getElementById('pokemon-list');
    const modal = document.getElementById('pokemon-modal');
    const closeModal = document.querySelector('.close');
    const searchInput = document.getElementById('search');
    const audio = document.getElementById('background-music');
    const muteButton = document.getElementById('mute-button');

    // Ajusta el volumen inicial
    audio.volume = 0.3; // 30% del volumen máximo

    // Variable para rastrear el estado de silencio
    let isMuted = false;

    // Reproducir audio después de la interacción del usuario
    function playAudioOnInteraction() {
        audio.play().then(() => {
            console.log('Audio reproducido correctamente.');
        }).catch((error) => {
            console.error('Error al reproducir el audio:', error);
        });

        // Eliminar el event listener después de la primera interacción
        document.removeEventListener('click', playAudioOnInteraction);
        document.removeEventListener('keydown', playAudioOnInteraction);
    }

    // Escuchar eventos de interacción (clic o tecla)
    document.addEventListener('click', playAudioOnInteraction);
    document.addEventListener('keydown', playAudioOnInteraction);

    // Función para alternar el silencio
    function toggleMute() {
        if (isMuted) {
            audio.play(); // Reactiva la música
            muteButton.textContent = '🔈'; // Cambia el ícono a altavoz activo
        } else {
            audio.pause(); // Silencia la música
            muteButton.textContent = '🔇'; // Cambia el ícono a altavoz silenciado
        }
        isMuted = !isMuted; // Cambia el estado de silencio
    }

    // Asigna la función al botón
    muteButton.addEventListener('click', toggleMute);

    // Lista local de los 151 Pokémon de Kanto
    const kantoPokemon = [
        "bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard",
        "squirtle", "wartortle", "blastoise", "caterpie", "metapod", "butterfree",
        "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata",
        "raticate", "spearow", "fearow", "ekans", "arbok", "pikachu", "raichu",
        "sandshrew", "sandslash", "nidoran-f", "nidorina", "nidoqueen", "nidoran-m",
        "nidorino", "nidoking", "clefairy", "clefable", "vulpix", "ninetales",
        "jigglypuff", "wigglytuff", "zubat", "golbat", "oddish", "gloom", "vileplume",
        "paras", "parasect", "venonat", "venomoth", "diglett", "dugtrio", "meowth",
        "persian", "psyduck", "golduck", "mankey", "primeape", "growlithe", "arcanine",
        "poliwag", "poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop",
        "machoke", "machamp", "bellsprout", "weepinbell", "victreebel", "tentacool",
        "tentacruel", "geodude", "graveler", "golem", "ponyta", "rapidash", "slowpoke",
        "slowbro", "magnemite", "magneton", "farfetchd", "doduo", "dodrio", "seel",
        "dewgong", "grimer", "muk", "shellder", "cloyster", "gastly", "haunter",
        "gengar", "onix", "drowzee", "hypno", "krabby", "kingler", "voltorb", "electrode",
        "exeggcute", "exeggutor", "cubone", "marowak", "hitmonlee", "hitmonchan",
        "lickitung", "koffing", "weezing", "rhyhorn", "rhydon", "chansey", "tangela",
        "kangaskhan", "horsea", "seadra", "goldeen", "seaking", "staryu", "starmie",
        "mr-mime", "scyther", "jynx", "electabuzz", "magmar", "pinsir", "tauros",
        "magikarp", "gyarados", "lapras", "ditto", "eevee", "vaporeon", "jolteon",
        "flareon", "porygon", "omanyte", "omastar", "kabuto", "kabutops", "aerodactyl",
        "snorlax", "articuno", "zapdos", "moltres", "dratini", "dragonair", "dragonite",
        "mewtwo", "mew"
    ];

    // Función para capitalizar nombres
    function capitalizeName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    // Función para obtener los datos de un Pokémon por su nombre
    async function getPokemonData(name) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        return data;
    }

    // Función para mostrar los Pokémon en la página
    async function displayPokemon() {
        for (const name of kantoPokemon) {
            const pokemon = await getPokemonData(name);
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card');

            pokemonCard.innerHTML = `
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h2>${capitalizeName(pokemon.name)}</h2>
                <p>#${pokemon.id}</p>
            `;

            // Añadir evento de clic a la tarjeta
            pokemonCard.addEventListener('click', () => showPokemonDetails(pokemon));

            pokemonList.appendChild(pokemonCard);
        }
    }

    // Función para mostrar los detalles del Pokémon en el modal
    function showPokemonDetails(pokemon) {
        const modalName = document.getElementById('modal-name');
        const modalImage = document.getElementById('modal-image');
        const modalId = document.getElementById('modal-id');
        const modalTypes = document.getElementById('modal-types');
        const modalHeight = document.getElementById('modal-height');
        const modalWeight = document.getElementById('modal-weight');
        const modalMoves = document.getElementById('modal-moves');

        // Mostrar los datos del Pokémon
        modalName.textContent = capitalizeName(pokemon.name);
        modalImage.src = pokemon.sprites.front_default;
        modalId.textContent = pokemon.id;
        modalTypes.textContent = pokemon.types.map(type => capitalizeName(type.type.name)).join(', ');
        modalHeight.textContent = `${pokemon.height / 10} m`;
        modalWeight.textContent = `${pokemon.weight / 10} kg`;

        // Mostrar los movimientos (limitado a 10 para no saturar)
        modalMoves.innerHTML = '';
        pokemon.moves.slice(0, 10).forEach(move => {
            const li = document.createElement('li');
            li.textContent = capitalizeName(move.move.name);
            modalMoves.appendChild(li);
        });

        // Mostrar el modal
        modal.style.display = 'block';
    }

    // Cerrar el modal al hacer clic en la "X"
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Función para filtrar Pokémon
    function filterPokemon() {
        const searchTerm = searchInput.value.toLowerCase();
        const pokemonCards = document.querySelectorAll('.pokemon-card');

        pokemonCards.forEach(card => {
            const name = card.querySelector('h2').textContent.toLowerCase();
            if (name.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Escuchar el evento de entrada en el buscador
    searchInput.addEventListener('input', filterPokemon);

    // Mostrar los Pokémon al cargar la página
    displayPokemon();
});
