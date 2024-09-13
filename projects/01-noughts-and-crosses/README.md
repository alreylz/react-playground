# Noughts and crosses game 
It still has some quirks to sove but mostly works (I wanted to do a recursive search and support any board size but it really makes no sense).

## Concepts applied
- Tile component creation
- Passing functions as props
- dealing with state changes, that are asynchronous operations, so `useEffect` should be used if we depend on states.
- `useState` all over the place to handle turns, tile status and game state (winning?).


![showcase.gif](media%2Fshowcase.gif)