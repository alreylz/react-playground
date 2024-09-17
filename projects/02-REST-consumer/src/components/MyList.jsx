import { useState, useEffect } from "react"
import FilmItem from "./FilmItem"
import "./List.css"


const REST_ENDPOINT = 'http://localhost/users'


const MyList = ({ name }) => {


    const [data, setData] = useState([])

    // Load data from REST Endpoint the first time the page is loaded
    useEffect(function getApi() {

        const req = fetch(REST_ENDPOINT,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }
            });

        console.log(req);
        req.then((resp) => resp.json()).then(body => {
            console.log(body)
            setData(Array.from(body))
        }).catch((err) => console.log(err))

    }, [])



    async function deleteApi(resourceJSON) {


        const req = fetch(REST_ENDPOINT,
            {
                method: "DELETE",
                body: resourceJSON,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                },
            });



    }


    function putApi(resource) {

        const req = fetch(REST_ENDPOINT,
            {
                method: "PUT",
                body: JSON.stringify(resource),
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                },
            });


        console.log(req);
        req.then((resp) => resp.json()).then(body => {

            console.log(body)
            
            // update the list of items replacing the value
            setData( (prev) =>{
                
                const nuArr = prev.map((film) => {
                    if(film.id === body.id)
                        return resource;
                    return film
                })
                return nuArr;
            })
            return true;
        }).catch((err) => {console.log(err); return false;})



    }













    if (!data)
        return <h1> Loading ... </h1>

    return (<>

        <h1> {name}</h1>

        {data && <h2>{JSON.stringify(data)}</h2>}

        {data.map((elem,) => {
            //aux
            parseKeysToMatchExpected(elem, { 'imgUrl': 'imgSrc' })

            console.log("PARSED TO MATCH", elem)
            return (
                <FilmItem key={elem.id}
                    film={elem}
                    handleRemove={() => {
                        //Fetch DELETE resource 
                        deleteApi(JSON.stringify(elem))
                        // Filter to remove from the local representation
                        setData(data.filter((m) => m.id != elem.id))
                    }}
                    handleEdit={putApi}

                >

                </FilmItem>
            )
        })}


    </>
    )
}





/* This code is useful, move to utils class. Solves the problem of having keys that are called something different than we expect*/
function parseKeysToMatchExpected(object, renamingKeyPairs) {


    for (const [oldKey, nukey] of Object.entries(renamingKeyPairs)) {

        if (!(oldKey in object)) continue;
        const valueToCopy = object[oldKey]
        console.log("Renaming key "+oldKey+" to new Key "+nukey+" value: "+valueToCopy)
        object[nukey] = (typeof valueToCopy === 'object') ? structuredClone(valueToCopy) : valueToCopy;
        delete object[oldKey]
    }

    return object



}




export default MyList