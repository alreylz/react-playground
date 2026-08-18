import { useState } from 'react';
import './App.css'
import RadarChart, { type GraphGridType, type RadarShapeType } from './components/RadarChart'
import * as d3 from "d3";


const SKILL_DATA = {
  performance: 5,
  skill: 5,
  potential: 9,
  contribution: 7,
  creativity: 3,
  kindness: 9,
  "hard-work": 5
};





const gridTypes: Record<GraphGridType, unknown> = {
  "polygonal": "polygonal",
  "spherical": "spherical",

}


const d3CurveConfigurations = {
  "cardinal-closed": d3.curveCardinalClosed,
  "catmullRom": d3.curveCatmullRom,
  "curveNatural": d3.curveNatural,
  "catmullRomClosed": d3.curveCatmullRomClosed.alpha(0.5)
}

const radarTypes: Record<RadarShapeType, unknown> = {
  "curved": "sharp",
  "sharp": "sharp"
}



function App() {



  const [data, setData] = useState(SKILL_DATA)

  const [selectedRotation, setSelectedRotation] = useState<number>(0)


  const [selectedGridType, setGridType] = useState<GraphGridType>("spherical")
  const [radarShapeTypeActive, setRadarShapeTypeActive] = useState<RadarShapeType>("sharp")
  const [curveConfigurationActive, setCurveConfigurationActive] = useState<keyof typeof d3CurveConfigurations | undefined>(undefined);




  const changeDataRandomly = () => {
    const newData = { ...SKILL_DATA }
    Object.entries(newData).map(([k, v]) => { newData[k] = Math.random() * 10 })
    setData(newData)
  }


  return (
    <>
      <h1> D3-based Radar Chart by @alreylz</h1>

      <section style={{ display: "grid", maxWidth: "80%", margin: "0 auto", gridTemplateColumns: "1fr" }}>

        <RadarChart
          data={data}
          graphGridType={gridTypes[selectedGridType]}
          radarShapeType={radarShapeTypeActive}
          radarSmoothingConfiguration={d3CurveConfigurations[curveConfigurationActive] ?? undefined}
          rotationOffset={selectedRotation}
        />
        <button
          style={{ justifySelf: "center", alignSelf: "center" }}
          onClick={() => changeDataRandomly()}> Reassing random  values</button>
        <input type="number"
          onChange={(event) => {
            setSelectedRotation(event.target.valueAsNumber || 0);
          }} />

      </section>

      <h2> Choose a type of grid</h2>
      <section>

        {Object.entries(gridTypes).map(([k]) => {

          return <button
            className={selectedGridType === k ? "active" : ""}
            onClick={() => {
              setGridType(k)
            }}
          > Asignar {k}</button>

        })
        }
      </section>




      <h2> Choose a rendering for the star shape (round or spiky) </h2>

      <section>
        {Object.entries(radarTypes).map(([k]) => {
          return <button
            className={radarShapeTypeActive === k ? "active" : ""}
            onClick={() => {
              setRadarShapeTypeActive(k)
            }}
          > {k}</button>

        })
        }
      </section>


      {radarShapeTypeActive !== "curved" ? null : <>
        <h2> Choose a curve configuration</h2>

        <section>

          {Object.entries(d3CurveConfigurations).map(([k]) => {

            return <button

              className={curveConfigurationActive === k ? "active" : ""}

              onClick={() => {
                setCurveConfigurationActive(k)
              }}
            > Asignar {k}</button>

          })
          }
        </section>
      </>}



    </>
  )
}

export default App
