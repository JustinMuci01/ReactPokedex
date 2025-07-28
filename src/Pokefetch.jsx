import {useState, useEffect} from "react";

function Pokefetch(){

    const [allPokemon, setAllPokemon] = useState([]);
    const[isShiny, setIsShiny] = useState(false);
    const[lowerBound, setLowerBound] = useState(1);
    const[upperBound, setUpperBound] = useState(151);
    const[generation, setGen] = useState(1);
    const[isComputing, setisComputing] = useState(0);
    let pokemonNumbers = [151, 100, 135, 107, 156, 72, 88, 96, 120]

    useEffect(()=>{
        setisComputing(1);
        setAllPokemon([]);
        const pokemonList = [];
            async function getPokemon(){
                for (let idNumber=lowerBound;idNumber<=upperBound;idNumber++)
            {
            try{
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idNumber}`);
                if (!response.ok)
                    {
                        throw new Error("Could not fetch resource")
                    }

                const data = await response.json();
                const newPokemon = {
                    id:data.id,
                    name: data.name,
                    photo: data.sprites.front_default,
                    shinyPhoto: data.sprites.front_shiny
                };
                pokemonList.push(newPokemon);
            }
            catch(error){
                console.error(Error);
            }
            }
            setAllPokemon(pokemonList);
            setisComputing(0);
        }
        getPokemon();
    }, [generation])

    function handleShinyInput()
    {
        setIsShiny(!isShiny);
    }

    function decreaseGeneration(){
        if (generation>1)
        {
            setUpperBound(lowerBound-1);
            setLowerBound(lowerBound-pokemonNumbers[generation-2])
            setGen(generation-1);
        }
    }

    function increaseGeneration()
    {
        if (generation < 9)
        {   
            setLowerBound(upperBound+1);
            setUpperBound(upperBound+pokemonNumbers[generation])
            setGen(generation+1);
        }
    }

    return(
        <>
        <button onClick= {handleShinyInput}>SHINY</button>
        <div className = "generationBar">
        <div className = "incDecButtons" onClick = {decreaseGeneration}> &larr; </div>
        <h1> GENERATION {generation}</h1>
        <div  className = "incDecButtons" onClick = {increaseGeneration}> &rarr; </div>
        </div>
        {isComputing && 
        <h2 className = "loadingText">Loading...</h2>
        ||
        <div className = "ListEnhance">
        <div className="CardList">
        <ul>
        {allPokemon.map((poke) =>(
        <li key = {poke.id} className = "PokemonCard" > 
        <h2>{poke.id}</h2>
        <p>{poke.name}</p>
        <img src={ isShiny ?poke.shinyPhoto : poke.photo} alt="" />
        </li>
            ))}
        </ul>
        </div>
        </div> 
        }

        </>
    )
}


export default Pokefetch;