import { useState, useEffect } from "react"
import FilmItem from "./FilmItem"
import "./List.css"


const REST_ENDPOINT = 'http://localhost/films'


const MyList = ({ name }) => {


    const [data, setData] = useState([])
    const [showCreateForm,setShowCreateForm] = useState(false)


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


    },[])

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
            setData((prev) => {

                const nuArr = prev.map((film) => {
                    if (film.id === body.id)
                        return resource;
                    return film
                })
                return nuArr;
            })
            return true;
        }).catch((err) => { console.log(err); return false; })



    }

    function postApi(resource) {

        const req = fetch(REST_ENDPOINT,
            {
                method: "POST",
                body: JSON.stringify(resource),
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                },
            });


        req.then((resp) => resp.json()).then(body => {

            console.log('New data from Server confirming POST', body)

            // update the list of items replacing the value
            setData((prev) => prev.concat(body))
            return true;
        }).catch((err) => { console.log(err); return false; })



    }






    if (!data)
        return <h1> Loading ... 🔃 </h1>

    return (<>

        <h1> {name}</h1>

        <div className="film-list-container">
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
        </div>
        {!showCreateForm && <button onClick={()=>setShowCreateForm(true)}> Add film ➕ </button>}



        {showCreateForm && <form className="fi-root fi-create-form" onSubmit={(ev) => {
            ev.preventDefault()
            const formElem = ev.target;
            const nuFilmObj = {
                name: document.querySelector("input[name='name']").value,
                year: document.querySelector("input[name='year']").value,
                imgSrc: document.querySelector("input[name='imgSrc']").value,
                director: document.querySelector("input[name='director']".value),
                description: document.querySelector("textarea[name='description']".value)
            }
            postApi(nuFilmObj)
        }}  >

            <button onClick={()=>setShowCreateForm(false)}> ❌</button>


            <header className="fi-create-form-header">
                <strong> Create a film 🎥</strong>
            </header>
            
            <label>Title</label>
            <input name="name" placeholder="Coco" />
            <label>Year</label>
            <input name="year" type="number" placeholder="2015" />
            <label>Image Link</label>
            <input name="imgSrc" placeholder="https://..." />
            <label>Director</label>
            <input name="director" type="text" />
            <label>Description</label>
            <textarea name="description" />
            <button type='submit' > Submit 📩</button>


        </form>}

    </>
    )
}





/* This code is useful, move to utils class. Solves the problem of having keys that are called something different than we expect*/
function parseKeysToMatchExpected(object, renamingKeyPairs) {


    for (const [oldKey, nukey] of Object.entries(renamingKeyPairs)) {

        if (!(oldKey in object)) continue;
        const valueToCopy = object[oldKey]
        console.log("Renaming key " + oldKey + " to new Key " + nukey + " value: " + valueToCopy)
        object[nukey] = (typeof valueToCopy === 'object') ? structuredClone(valueToCopy) : valueToCopy;
        delete object[oldKey]
    }

    return object



}




export default MyList;