import React from 'react'
import ReactDOM from 'react-dom/client'
import "./TwitterCard.css"

// My component
const TwitterCard = ({username,isFollowing}) => {

    const imgUrl = `https://unavatar.io/${username}`

    return (<>
    <article className="twitter-card-root">
        <header className="twitter-card-header">
            <img className="twitter-card-profile-pic" src={imgUrl}  alt={username} />
            <strong className="twitter-card-header-name">{username}</strong>
            <span className="twitter-card-header-username">@{username}</span>
        </header>
        <aside>

            <button className="twitter-following-button">{isFollowing == true ? "Siguiendo" : "Seguir" }</button>
        </aside>
    </article>
    </>)

}



export default TwitterCard