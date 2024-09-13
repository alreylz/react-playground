import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Board from './Board.jsx'
import './index.css'




function disableDefaultLClick(){
    document.body.addEventListener("click", function(e) { e.preventDefault(); }, true)
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Board />
  </StrictMode>,
)
