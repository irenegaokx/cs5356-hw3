class PokemonCard {
    constructor() {
        this.button = document.getElementById('pokemonButton');
        this.container = document.getElementById('pokemonCard');
        this.content = document.getElementById('pokemonContent');
        this.closeButton = this.container.querySelector('.close-button');
        this.isLoading = false;
        this.maxPokemons = 1008; 

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