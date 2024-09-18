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
                        <strong className="fi-h1"> 
                            <span className="fi-header-name-txt">{film.name}</span>  <span className="fi-header-year-txt">({film.year})</span>
                        </strong>
                        <strong className="fi-h2">
                            Directed by <span className="fi-header-director">{film.director}</span>
                        </strong>
                    </header>
                    
                    <button onClick={() => {
                        setShowDetails(!showDetails)
                    }}> Know more ➕</button>

                    {showDetails && (<p className="fi-description">
                        {film.description}
                    </p>)}

                    <div className="fi-edition-button-group">
                        <button onClick={() => setMode("edit")} > Edit ✏️</button >
                        <button onClick={handleRemove}> Remove 🗑️</button>
                    </div>
                </section>

            </>
            )
        case "edit":
            return (
                <section className='fi-root' data-status="edit" >
                    <header className="fi-header">
                        <img src={film.imgSrc} alt={film.name + " poster"} />
                        <label>Title</label>
                        <input type="text" name="name" onChange={handleFormDataValue} className="fi-title" defaultValue={formData["name"]} />
                        <label>Year</label>
                        <input type="number" name="year" onChange={handleFormDataValue} className="fi-title" defaultValue={formData["year"]} />
                        <label>Director</label>
                        <input type="text" name="director" onChange={handleFormDataValue} className="fi-title" defaultValue={formData["director"]} />
                    </header>
                    <label>Description</label>
                    {<textarea name='description' onBlur={handleFormDataValue} defaultValue={formData["description"]}></textarea>}
                    
                    <div className="fi-edition-button-group">
                    <button onClick={()=>setMode("read")}>🔙</button>
                    
                    <button onClick={() => {
                        handleEdit(formData);
                        console.log("should change mode");
                        setMode("read");
                    }}> Confirm Edition ✅</button>
                    <button onClick={handleRemove}>Remove 🗑️</button>

                    </div>
                </section>
            )
        default:
            return <h1> Unsupported mode</h1>
    }

}



export default FilmItem;