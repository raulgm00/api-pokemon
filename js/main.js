//agarrar los elemntos
const containerPoke = document.querySelector(".container");
const searchPoke = document.querySelector("#search");
let pokemonsGlobal = [];
let pokemonsCopy = [];
let inputActual = "";

async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}

const getPokemons = async (limit) => {
  const listaPokemon = await fetchData(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
  );
  const pokePromesas = listaPokemon.results.map((poke) => fetchData(poke.url));
  const pokes = await Promise.all(pokePromesas).then((response) => {
    const pokemones = response.map((info) => {
      return {
        name: info.name,
        id: info.id,
        img: info.sprites.other.dream_world.front_default,
        types: info.types.map((e) => e.type.name),
        attack: info.stats.find((stat) => stat.stat.name === "attack")
          .base_stat,
      };
    });
    
    return pokemones;
  });
  return pokes;
};

const main = async () => {
  // Llamamos los pokemons de la api
  const pokemons = await getPokemons(100);
  //pasamos los pokemons a una variable global
  pokemonsGlobal = [...pokemons];
  pokemonsCopy = [...pokemons];
  renderizarPokemon();
};

const renderizarPokemon = () => {
  //ITERAR EL ARRAY POKEMON
  containerPoke.innerHTML = "";
  pokemonsGlobal.forEach((poke) => {
    const template = 
    `<div class="card">
        <div>
          <img class="img" src="${poke.img}">
        </div>
        <div class="info">
            <h4>${poke.name}</h4>
            <h4>${poke.id}</h4>
            <h4>${poke.types}</h4>
            <h4>${poke.attack}</h4>
        </div>
    </div>`;
    containerPoke.innerHTML += template;
  });
};

const filterPoke = (e) => {
  const value = e.target.value.trim().toLowerCase();
  // console.log(`Filtra pokemon ${value}`)
  
  if (value === "") {
    pokemonsGlobal = pokemonsCopy;
    
  } else {
    if(value  === inputActual ){
      const poke = pokemonsGlobal.filter((poke) => poke.name.includes(value));
      pokemonsGlobal = [...poke];
      inputActual = value;
    }else{
      pokemonsGlobal = pokemonsCopy;
      const poke = pokemonsGlobal.filter((poke) => poke.name.includes(value));
      pokemonsGlobal = [...poke];
    } 

  }
  renderizarPokemon();
};




const renderPoke = (e) => {
  const value = e.target.value.trim().toLowerCase();
  console.log(`Renderizar pokemon ${value}`)
  const poke = pokemonsGlobal.filter((poke) => poke.name.includes(value));
  pokemonsGlobal = [...poke];

  renderizarPokemon();
};

searchPoke.addEventListener("input", filterPoke);


main();
