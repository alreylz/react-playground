
import React from 'react'
import ReactDOM from 'react-dom/client'
import TwitterCard from './TwitterCard.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
  <>
        <div style={{display:"flex"}}>



                  <aside style={{ backgroundColor:"red", display:"flex", flexDirection:"column", alignItems:"center"}}>
                        <h2>To follow:</h2>
                  <TwitterCard username="pepe" isFollowing={true} />
                  <TwitterCard username="juanpedrou" isFollowing={true} />
                  <TwitterCard username="chikito" isFollowing={false} />
                  </aside>

              </div>
  </>,
)
