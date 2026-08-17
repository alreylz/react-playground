import { useEffect, useLayoutEffect, useRef } from "react";
import type { Selection } from "d3";

import "./RadarChart.css"
import * as d3 from "d3";



export type D3SvgSelection<T extends SVGElement = SVGElement> =
    Selection<T, unknown, null, undefined>;

/**
draws a line between points
*/
function drawLine(coordsA: { x: number, y: number }, coordsB: { x: number, y: number },
    color: string, appendTo: D3SvgSelection) {
    const [xA, yA] = coordsA;
    const [xB, yB] = coordsB;

    console.log(`Attempt of drawing lines: (${xA}, ${yA}) to (${xB}, ${yB})`);

    appendTo
        .append("line")
        .attr("x1", xA)
        .attr("y1", yA)
        .attr("x2", xB)
        .attr("y2", yB)
        .attr("stroke", color);
}



function drawPolygon(
    coordsArray: Array<{ x: number, y: number }>,
    appendTo: D3SvgSelection,
    //For further customization
    config: {
        shapePreset: RadarShapeType
        curveConfig?: unknown,

        fill?: string,
        stroke?: string,

        stylePreset?: "data" | "grid",
        customDecorator?: (polygon: D3SvgSelection) => D3SvgSelection
    } = { shapePreset: "sharp" }
) {


    let elemShape: D3SvgSelection | null = null

    switch (config.shapePreset) {

        case "curved":
            console.log(`✏️ Drawing Curved shape with ${coordsArray.length} vertices from coords : `, coordsArray);


            const lineGenerator = d3.line<{ x: number; y: number }>()
                .x(d => d.x)
                .y(d => d.y)
                .curve(
                    config.curveConfig ?? d3.curveCatmullRom
                )

            console.log(`SMOOTHING: ${config.curveConfig}`)



            const curvedPathShape = appendTo.
                append("path")
                .datum(coordsArray)
                .attr("d", lineGenerator)
                .attr("fill", config?.fill ?? "var(--polygon-color, yellow )")
                .attr("stroke", config?.stroke ?? "teal");

            elemShape = curvedPathShape

            break;

        case "sharp":
        default:

            //Create the path appending coordinates to svg <polygon> 
            const pointsStringSvg = coordsArray
                .map((v) => `${v.x},${v.y} `)
                .reduce(function (result, item) {
                    return result + item;
                }, "");

            console.log(`✏️ Drawing Polygon with ${coordsArray.length} vertices from coords : `, coordsArray, pointsStringSvg);
            //Base polygon creation
            const polygonShape = appendTo
                .append("polygon")
                .attr("points", pointsStringSvg)


            elemShape = polygonShape
            break;


    }


    if (!elemShape) {
        console.error("No shape was generated for polygon, parameters are probably wrong")
    }





    //Allows putting complex logic as if I was to write the .attr() from the outside, ignores other configurations
    if (config?.customDecorator) {
        config?.customDecorator(elemShape);
        return;
    }

    // If there are styles that I like by default and I want to reuse them
    if (config?.stylePreset)
        switch (config?.stylePreset) {
            case "data":
                elemShape
                    .attr("fill", config?.fill ?? "var(--polygon-color, yellow )")
                    .attr("stroke", config?.stroke ?? "red");
                break;
            case "grid":
                elemShape
                    .attr("fill", "transparent")
                    .attr("stroke", "gray");
                break;

        }

    //overwrite some configurations if explicitly included
    if (config?.fill || config?.stroke) {
        elemShape
            .attr("fill", config?.fill ?? "var(--polygon-color, yellow )")
            .attr("stroke", config?.stroke ?? "teal");
    }
}



function drawLabel(
    label: string,
    respectToCoords: { x: number, y: number },
    appendTo: D3SvgSelection,
    config = {
        anchor: "middle", fontSize: 2,
        offsetY: -20,
        className: "graphlabel"
    }

) {

    const labelGroup = appendTo.append("g")
        .attr("class", "label-group")
        .attr("font-size", `${config.fontSize}em`)



    const text = labelGroup
        .append("text")
        .attr("class", config.className)
        .attr("x", respectToCoords.x)
        .attr("y", respectToCoords.y)
        .attr("text-anchor", config.anchor)
        .attr("dominant-baseline", "middle")
        .text(label);

    const bbox = text.node()!.getBBox();


    //Background label box
    labelGroup
        .insert("rect", "text")
        .attr("class", "label-container")
        .attr("x", bbox.x - 8)
        .attr("y", bbox.y - 4)
        .attr("width", bbox.width + 16)
        .attr("height", bbox.height + 8)
        .attr("rx", 4)
        .attr("fill", "white");


}

//TESTING
//drawLabel("pepe", { x: 100, y: 100 }, d3.select("svg"));

// let svgElem = document.querySelector("svg");

// // Allows inserting circles under the cursor
// svgElem.addEventListener("click", (event) => {
//     //get actual bounding box of elem in browser
//     var svgRect = svgElem.getBoundingClientRect();

//     let cursorInfo = {
//         x: event.clientX,
//         y: event.clientY
//     };

//     let compX = cursorInfo.x - svgRect.x;
//     let compY = cursorInfo.y - svgRect.y;

//     console.log(`Corrected ${compX} , ${compY}`);

//     d3.select("svg")
//         .append("circle")
//         .attr("cx", compX)
//         .attr("cy", compY)
//         .attr("r", 10)
//         .attr("fill", "teal");

//     //console.log(cursorInfo);
// });

// Trying to create a star graph



export type GraphGridType = "spherical" | "polygonal"
export type RadarShapeType = "sharp" | "curved"



function createRadarGraph(
    //the parent
    ref: SVGElement,
    //the data itself, as pairs "attribute label": number 
    attributes: Record<string, number>,
    //further configuration regarding how elements are rendered
    config: {


        gridType: GraphGridType,
        radarType: RadarShapeType,
        radarSmoothingConfiguration?: unknown

        //rotation-offset, to make things look more aligned depending on the context where the chart appears
        rotateStart?: number,

    } = {
            gridType: "polygonal",
            radarType: "sharp"
        }) {



    const graphd3Root = d3.select(ref)

    if (ref.hasChildNodes())
        //REMOVE (if rerendering)
        graphd3Root.selectAll("g")
            .remove();

    const graphConfig = {
        x: 400,
        y: 400,
        radius: 275,
        offsetDeg: config.rotateStart ?? 0,
        dimensions: Object.keys(attributes).length,
        fontSize: 2
    };

    console.log(graphConfig);

    const offsetRadians = (graphConfig.offsetDeg * Math.PI) / 180;

    let i = 0;

    // Boundaries and data of the actual star
    const polygonData = [];
    const bounds = { min: 0, max: Math.max(...Object.values(attributes)) };
    console.log(Object.values(attributes));

    //Divide radius in max elements (get the length of each step in the graph)
    const unitLength = graphConfig.radius / bounds.max;

    console.log("Unit Lenght: ", unitLength);


    // BACKGROUND & divider lines 
    const gridLayer = graphd3Root.append('g').attr('class', 'grid-layer')



    if (config?.gridType === "spherical") {
        //background circle
        gridLayer
            .append("circle")
            .attr("cx", graphConfig.x)
            .attr("cy", graphConfig.y)
            .attr("r", graphConfig.radius)
            .attr("fill", "var(--grid-bg, gray)");

        console.log("Graph Background DRAWN");


        for (let i = 1; i <= bounds.max; i++) {
            //Draw unit lenght radiuses
            gridLayer
                .append("circle")
                .attr("cx", graphConfig.x)
                .attr("cy", graphConfig.y)
                .attr("r", i * unitLength)
                .attr("fill", "none")
                .attr("stroke", "var(--area-color,black)")

        }

    }



    const dataLayer = graphd3Root.append('g').attr('class', 'data-layer')
    const labelLayer = graphd3Root.append('g').attr('class', 'label-layer')
    const polygonLayer = graphd3Root.append('g').attr('class', 'polygon-layer')



    if (config?.gridType === "polygonal") {
        //for each unit step, draw polygon
        for (let radius = 1; radius < bounds.max; radius++) {
            const thisRadiusPolygonPoints = []

            //Get coordinates for all points in the polygon to draw it
            for (let step = 0; step < graphConfig.dimensions; step++) {
                const newRadians =
                    step * ((2 * Math.PI) / graphConfig.dimensions) + offsetRadians;
                const posX = graphConfig.x + radius * unitLength * Math.cos(newRadians);
                const posY = graphConfig.y + radius * unitLength * Math.sin(newRadians);
                thisRadiusPolygonPoints.push({ x: posX, y: posY })
            }

            drawPolygon(thisRadiusPolygonPoints, gridLayer, { stylePreset: "grid" })
        }
    }


    // Render stuff in a circle using polar coordinates
    i = 0;
    for (const [k, v] of Object.entries(attributes)) {
        // Get angle slice to represent all dimensions
        const newRadians =
            i * ((2 * Math.PI) / graphConfig.dimensions) + offsetRadians;

        console.log(newRadians);

        // To draw the end of an axis
        const posX = graphConfig.x + graphConfig.radius * Math.cos(newRadians);
        const posY = graphConfig.y + graphConfig.radius * Math.sin(newRadians);


        //To draw the datapoints themselves
        const posXDataPoint = graphConfig.x + unitLength * v * Math.cos(newRadians);
        const posYDataPoint = graphConfig.y + unitLength * v * Math.sin(newRadians);

        // Polar coordinates (References of the axes)
        //Endpoints of the axes
        dataLayer
            .append("circle")
            .attr("class", "axis-outerpoint")
            .attr("cx", posX)
            .attr("cy", posY)
            .attr("r", 2);

        // Axis line
        drawLine(
            [graphConfig.x, graphConfig.y],
            [posX, posY],
            "var(--axis-line-color, blue)",
            gridLayer
        );

        //Draw datapoint
        dataLayer
            .append("circle")
            .attr("cx", posXDataPoint)
            .attr("cy", posYDataPoint)
            .attr("r", 10)
            .attr("fill", "var(--datapoints-color,red)");

        polygonData.push({ x: posXDataPoint, y: posYDataPoint });

        //Draw each label
        drawLabel(
            k,
            {
                x: posX + graphConfig.fontSize,
                y: posY + graphConfig.fontSize
            },
            labelLayer
        );

        i++;
    }



    //THE ACTUAL DATA POLYGON FORMED BY JOINING THE POINTS IN EACH DIMENSION
    const actualDataPolygon = drawPolygon(polygonData,
        polygonLayer,
        {
            stylePreset: "data",
            shapePreset: config.radarType,
            curveConfig: config.radarSmoothingConfiguration
        });

    labelLayer.raise()
}






interface RadarChartProps {

    data: Record<string, number>,
    graphGridType?: GraphGridType,
    radarShapeType?: RadarShapeType
    radarSmoothingConfiguration?: unknown
    rotationOffset?: number




}

export default function RadarChart(
    {
        data,
        // Look and feel
        graphGridType,
        radarShapeType,
        radarSmoothingConfiguration,
        rotationOffset

    }: RadarChartProps) {


    const graphRootRef = useRef<SVGSVGElement>(null)


    useEffect(() => {

        if (!graphRootRef.current) return;



        const toApplyConfig = {}

        if (graphGridType) toApplyConfig.gridType = graphGridType;
        if (radarShapeType) toApplyConfig.radarType = radarShapeType;
        if (radarSmoothingConfiguration) toApplyConfig.radarSmoothingConfiguration = radarSmoothingConfiguration;
        if (rotationOffset) toApplyConfig.rotateStart = rotationOffset;




        createRadarGraph(graphRootRef.current,
            data,
            toApplyConfig
        );



    }, [data, graphGridType, radarShapeType, radarSmoothingConfiguration, rotationOffset])


    return <div style={{ display: "grid", justifyItems: "center", background: "var(--bg)" }}>

        <svg
            className="RadarChart"
            ref={graphRootRef}
            viewBox="0 0 800 800"
        >
        </svg>
    </div>

}