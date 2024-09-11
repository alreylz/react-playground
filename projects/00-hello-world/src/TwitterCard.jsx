import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import "./TwitterCard.css"

// My component
const TwitterCard = ({username, initialIsFollowing}) => {

    //This initialization happens only once
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)

    const imgUrl = `https://unavatar.io/${username}`
    // Showing different states depending on actual following status
    const buttonText = isFollowing == true ? "Siguiendo" : "Seguir";
    // To handle the several states of the following button
    const buttonClassStyle = isFollowing ? "twitter-following-button status-following" : "twitter-following-button";


    const handleOnClick = () => {
        setIsFollowing(!isFollowing);
    }
    return (<>
        <article className="twitter-card-root">
            <header className="twitter-card-header">
                <img className="twitter-card-profile-pic" src={imgUrl} alt={username}/>
                <div className="twitter-names-div">
                    <strong className="twitter-card-header-name">{username}</strong>
                    <span className="twitter-card-header-username">@{username}</span>
                </div>
            </header>
            <aside>

                <button className={buttonClassStyle} onClick={handleOnClick}>
                    <span className="default-show">{buttonText}</span>
                    <span className="unfollow-show"> Dejar de seguir </span>
                </button>
            </aside>
        </article>
    </>)

}


export default TwitterCard