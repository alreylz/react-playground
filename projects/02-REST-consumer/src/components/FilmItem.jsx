import { useState, useEffect } from "react"
import './FilmItem.css'

const FilmItem = ({ film, handleRemove, handleEdit, initialMode = "read" }) => {



    const [showDetails, setShowDetails] = useState(false)
    const [mode, setMode] = useState(initialMode)

    // Object containing the information of the form to submit to change the info in the server
    const [formData, setFormData] = useState(structuredClone(film))



    useEffect(() => {
        console.log("Changed mode")

        console.log("film:", film)
        console.log("formData:", formData)

        const nuObj = { ...film, ...formData };
        console.log(nuObj)
        setFormData(nuObj)
    }, [mode])



    // Called to process changes of each form element and what 
    function handleFormDataValue(ev) {
        const theValue = ev.target.value;
        const dataName = ev.target.name;
        console.log("Changed value of form item " + dataName + ", value: " + theValue)

        // change only the affected key
        setFormData((prev) => {

            if (!(dataName in prev)) {
                console.log("check again your input fields because this key is not present in the original data")
                return;
            }
            console.log("trying to update The value of item")
            // check if object has key first todo    
            const keyValPair = { [dataName]: theValue };
            return { ...prev, ...keyValPair }
        })

        console.log(formData)

    }

    switch (mode) {

        case "read":

            return (<>
                <section className='fi-root'>
                    <header className="fi-header">
                        <img src={film.imgSrc} alt={film.name + " poster"} />
                        <h1 className="fi-title"> {film.name}  ({film.year})</h1>
                        <h2>Directed by {film.director}</h2>
                    </header>
                    <button onClick={() => {
                        console.log("clicked")
                        setShowDetails(!showDetails)
                    }}> Know more</button>

                    {showDetails && (<p>
                        {film.description}
                    </p>)}

                    <button onClick={handleRemove}> Remove 🗑️</button>
                    <button onClick={() => setMode("edit")} > Edit ✏️</button >

                </section>

            </>
            )
        case "edit":
            return (
                <section className='fi-root'>
                    <header className="fi-header">
                        <img src={film.imgSrc} alt={film.name + " poster"} />
                        <input type="text" name="name" onChange={handleFormDataValue} className="fi-title" defaultValue={formData["name"]} />
                    </header>

                    {<textarea name='description' onBlur={handleFormDataValue} defaultValue={formData["description"]}></textarea>}
                    <button onClick={handleRemove}>Remove 🗑️</button>
                    <button onClick={async () => {
                        const success = await handleEdit(formData);
                        if (!success) {
                            console.log("Error in the remote applying of changes")
                            return;
                        }
                        setMode("read");
                    }}> Confirm Edition</button>

                </section>
            )
        default:
            return <h1> Unsupported mode</h1>
    }

}



export default FilmItem;