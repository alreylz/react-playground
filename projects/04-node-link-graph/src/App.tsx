import './App.css'
import data from "./assets/data.json"
import customData from "./assets/custom.data.json"
import { ForceDirectedGraph } from './components/ForceDirectedGraph'

function App() {
  return (
    <>
      <h1> Force directed graph</h1>
      <ForceDirectedGraph data={data} />
    </>
  )
}

export default App
