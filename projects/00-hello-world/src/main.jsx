import React from 'react'
import ReactDOM from 'react-dom/client'
import "./main.css";
import TwitterCard from './TwitterCard.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <>
        <div style={{display: "flex"}}>
            <aside style={{
                backgroundColor: "#476874",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "space-around",
                gap: "1rem",
                padding: "1rem"
            }}>
                <h2>Who to follow:</h2>
                <TwitterCard username="alreylz" initialIsFollowing={true}/>
                <TwitterCard username="ysinotelodigo" initialIsFollowing={true}/>
                <TwitterCard username="orlagartland" initialIsFollowing={true}/>
                <TwitterCard username="theokatzman" initialIsFollowing={true}/>
                <TwitterCard username="joedart" initialIsFollowing={false}/>
            </aside>

        </div>
    </>,
)
