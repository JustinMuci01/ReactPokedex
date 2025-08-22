import {useState, useEffect} from "react";
import star from "./img/star.png";
import pokeball from "./img/pokeball.png";

function Pokefetch(){

    const [allPokemon, setAllPokemon] = useState([]);
    const[isShiny, setIsShiny] = useState(false);
    const[lowerBound, setLowerBound] = useState(1);
    const[upperBound, setUpperBound] = useState(151);
    const[generation, setGen] = useState(1);
    const[isComputing, setisComputing] = useState(0);
    const[enhancedPoke, setEnhancedPoke] = useState();
    const[isEnhanced, setIsEnhanced] = useState(false);
    const[enhancedComputing, setEnhancedComputing] = useState(false);

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
                    shinyPhoto: data.sprites.front_shiny,
                    type: data.types,
                    cry: data.cries.legacy
                };
                pokemonList.push(newPokemon);
            }
            catch(error){
                console.error(error);
            }
            }
            setAllPokemon(pokemonList);
            setisComputing(0);
        }
        getPokemon();
    }, [generation])

    useEffect(()=>
    {
            async function getAdditionalInfo(){
            try{
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${enhancedPoke.name}`);
                if (!response.ok)
                    {
                        throw new Error("Could not fetch resource")
                    }

                const data = await response.json();
                let textString;
                for (let i=0;i<data.flavor_text_entries.length;i++)
                {
                    if (data.flavor_text_entries[i].language.name === "en")
                    {
                        textString = data.flavor_text_entries[i].flavor_text;
                        break;
                    }
                }
                const newInfo = {
                    text: textString,
                    habitat: data.habitat?.name ?? "N/A",
                    happiness: data.base_happiness,
                    cap_rate: data.capture_rate,
                    has_fetched: true
                };

                setEnhancedPoke(prev => ({
                    ...prev, ...newInfo
            }));
            }
            catch(error){
                console.error(error);
            }finally{
                    setEnhancedComputing(0);
            }
        }
        if (isEnhanced && !enhancedPoke.has_fetched)
        {
            setEnhancedComputing(1);
            getAdditionalInfo();
        }   
        
        console.log(enhancedPoke);
    }, [enhancedPoke])
    
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

    function enhanceView(poke)
    {
        setEnhancedPoke(poke);
        setIsEnhanced(true);
        console.log(enhancedPoke);
    }

    function deEnhanceView()
    {
        setIsEnhanced(false);
        setEnhancedPoke();
    }

    return(
        <>
        <head>
        <a id="top"></a>
        <title>Pokedex</title>
        <meta name = "description" content = "Interactive Pokedex including all current pokemon generations, made with REACT"/>
        <meta name="author" description="Justin Muci"/>
        <link rel="icon" href= {pokeball} />

        </head>
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
        <p>{poke.name.toUpperCase()}</p>
        <img onClick = {() => {
            enhanceView(poke);
            window.scrollTo({top : 0, behavior:'smooth'})}
        } 
        src={ isShiny ?poke.shinyPhoto : poke.photo} alt="" />
        </li>
            ))}
        </ul>
        </div>
        {isEnhanced && 
        <div className = "displayEnhancedView">
            <button className = "cancelButton" onClick = {()=> deEnhanceView()}>X</button>
            <h2>{enhancedPoke.id}</h2>
            <h2>{enhancedPoke.name.toUpperCase()}</h2>
            <img className = "enhancedImage" src={isShiny ? enhancedPoke.shinyPhoto : enhancedPoke.photo} alt="" />
            {enhancedComputing ? <p className = "descText" >Loading...</p> : 
            <>
            {enhancedPoke?.type[1] ? <p className = "descText"> Type: {enhancedPoke.type[0].type.name.toUpperCase()}/{enhancedPoke.type[1].type.name.toUpperCase()} </p>
            :<p className = "descText"> Type: {enhancedPoke.type[0].type.name.toUpperCase()} </p>}
            <p className = "descTitle">DESCRIPTION:</p>
            <p className = "descText">{enhancedPoke.text}</p>
            <p className = "descText">HABITAT: {enhancedPoke.habitat}</p>
            <p className = "descText">HAPPINESS: {enhancedPoke.happiness}</p>
            <p className = "descText">CATCH RATE: {enhancedPoke.cap_rate}</p>
            </>
            } 

        </div>
            }
        </div> 
        }
        <img src = {star} className = "ShinyButton" onClick= {handleShinyInput} />

        </>
    )
}


export default Pokefetch;