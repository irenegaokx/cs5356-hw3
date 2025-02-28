class PokemonCard {
    constructor() {
        this.button = document.getElementById('pokemonButton');
        this.container = document.getElementById('pokemonCard');
        this.content = document.getElementById('pokemonContent');
        this.closeButton = this.container.querySelector('.close-button');
        this.isLoading = false;
        this.maxPokemons = 1008; 

        // Add new properties for button movement
        this.buttonContainer = document.querySelector('.pokemon-button-container');
        this.maxMove = 10; // Reduced from 20 to 10 pixels for smaller movement range
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.button.addEventListener('click', () => this.showPokemonCard());
        this.closeButton.addEventListener('click', () => this.hideCard());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.hideCard();
            }
        });

        // Add mouse move listener to whole document
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleMouseMove(e) {
        // Get button container position
        const rect = this.buttonContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from mouse to button center
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Calculate movement (closer mouse = more movement)
        const moveX = (distanceX / window.innerWidth) * this.maxMove;
        const moveY = (distanceY / window.innerHeight) * this.maxMove;

        // Apply smooth transform
        this.button.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    getRandomPokemonId() {
        return Math.floor(Math.random() * this.maxPokemons) + 1;
    }

    async showPokemonCard() {
        if (this.isLoading) return;
        
        this.container.classList.remove('hidden');
        this.isLoading = true;
        this.content.innerHTML = '<div class="loading">Loading...</div>';

        try {
            const randomId = this.getRandomPokemonId();
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const pokemon = await response.json();

            this.content.innerHTML = `
                <div class="pokemon-info">
                    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
                    <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                    <p>Height: ${pokemon.height/10}m</p>
                    <p>Weight: ${pokemon.weight/10}kg</p>
                    <p>Abilities: ${pokemon.abilities.map(a => 
                        a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)
                    ).join(', ')}</p>
                    <p>Base Experience: ${pokemon.base_experience}</p>
                    <p>Pokédex #${pokemon.id}</p>
                </div>
            `;
        } catch (error) {
            this.content.innerHTML = `
                <div class="error">
                    <p>Oops! Couldn't catch that Pokémon.</p>
                    <p>Try again later!</p>
                </div>
            `;
        } finally {
            this.isLoading = false;
        }
    }

    hideCard() {
        this.container.classList.add('hidden');
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PokemonCard();
}); 