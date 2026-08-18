import { useEffect, useRef, useState, type ReactNode } from "react"
import * as d3 from "d3"
import "./ForceDirectedGraph.css"
interface GraphNode {
    id: string,
    nodeProperties?: Record<string, unknown>
}


//Links or edges
interface GraphEdge {
    source: string,
    target: string
}




function renderForceDirectedGraph(
    data: { nodes: Array<GraphNode>, links: Array<GraphEdge> },
    ref,
    onSelectedNode: (
        selectedNodeInfo: GraphNode,
        mousePositions: { x: number, y: number }) => void
    ,
    config?: {
        baseNodeWidth: number,

    }


) {

    const graphd3Root = d3.select(ref)


    //REMOVE (if rerendering)
    if (ref?.hasChildNodes())
        graphd3Root.selectAll("g")
            .remove();



    //Create copies of links and nodes (because these get mutated)
    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    console.log("graphd3Root", ref)


    const width = 800
    const height = 800


    const edgesLayer = graphd3Root.append("g").attr("class", "edges-layer")
    const nodesLayer = graphd3Root.append("g").attr("class", "nodes-layer")



    //Create a simulation for my given array of nodes (this mutates the passed data, adding properties to control the simulation)
    const simulation = d3.forceSimulation(nodes);
    //Add forces to it
    simulation
        .force("link", d3.forceLink(links).id(d => d.id)
            .distance(link => {
                //Generate distance based on the value (for instance, weights greater than 60 are separated around 50 units, while those smaller get further away)
                return link.value > 60 ? 50 : 300
            }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);


    // Add a line for each link, and a circle for each node.
    const link = edgesLayer
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
        //Make the stroke depend on some property of the edges themselves
        .attr("stroke-width", d => Math.sqrt(d.value) <= 0 ? 2 : Math.sqrt(d.value));

    const node = nodesLayer
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll()
        .data(nodes)
        .join("g")
        .attr("x", d => Math.random() * 800)
        .attr("y", d => Math.random() * 800)
        .attr("class", "node-and-info-group")

    const nodeShape = node.append("circle").attr("class", "rendered-node")
        .attr("r", config?.baseNodeWidth ?? 5)
        //  .attr("fill", d => color(d.group));
        .attr("fill", "blue");



    let currentlySelectedNodeId = null

    const handleAnyGivenSelectedNode = (event, selectedNodeData) => {

        const mouseCoords = { x: event.clientX, y: event.clientY };
        currentlySelectedNodeId = selectedNodeData.id



        //I can do this kind of things, working with the group of nodeShapes
        nodeShape.attr("fill", node =>
            node.id === currentlySelectedNodeId ? "red" : "blue"
        );


        onSelectedNode?.(selectedNodeData, mouseCoords)



    }

    function handleDeselectedNode() {
        onSelectedNode?.(null)
    }

    //Allow clicking
    nodeShape.on("click", handleAnyGivenSelectedNode)


    nodeShape.append("title")
        .text(d => d.id);


    const nodeDataBox = node
        .append("text")
        .attr("dominant-baseline", "middle")
        .attr("transform-box", "fill-box")
        .attr("y", "-1em")
        .attr("x", d => `-${d.id.length / 2}ex`)
        .attr("font-size", `0.5em`)
        .attr("stroke", "black")
        .text(d => d.id)




    // Set the position attributes of links and nodes each time the simulation ticks.
    //Creates positions in the nodes themselves
    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        //Move the whole group
        node
            .attr("transform", d => `translate(${d.x}, ${d.y})`)


    }



    //Stop the simulation
    //invalidation.then(() => simulation.stop());


}




function RenderFlatNodeInfo(nodeInfo): ReactNode {


    const flattened = {
        ...nodeInfo,
        ...nodeInfo.nodeProperties
    };

    ["x", "y", "vy", "vx"].map((v) => delete flattened[v])
    delete flattened.nodeProperties

    return <>
        {Object.entries(flattened).map(([k, v]) => {
            return <div ><span style={{ fontWeight: "bold" }}> {k}:</span> <span>{v}</span></div>
        })}
    </>




}




interface ForceDirectedGraphProps {
    data: { nodes: Array<GraphNode>, links: Array<GraphEdge> }
}


export function ForceDirectedGraph({ data }: ForceDirectedGraphProps) {

    const graphRootRef = useRef(null)
    const [selectedNode, setSelectedNode] = useState(null)

    useEffect(() => {

        if (!graphRootRef.current) return;

        renderForceDirectedGraph(data,
            graphRootRef.current,
            // What runs when i select a node
            (selectedNodeData, mousePos) => {
                setSelectedNode(selectedNodeData)
            },
            //Additional configurations
            { baseNodeWidth: 15 }
        )
    },
        [data])



    return <div className="interactive-graph-wrapper" style={{ margin: "0 auto", minWidth:"50vw" }}>

        <div style={{ position: "relative" }}>

            <svg

                width={"100%"}
                style={{ background: "white" }}

                ref={graphRootRef}

                viewBox="0 0 800 800"
            >
            </svg>
            {selectedNode && <div style={{
                position: "absolute", bottom: "0", right: "0",

                color: "black",
                width: "fit-content",
                minHeight: "10vh", border: "1px solid black",
                display: "grid",
                justifyItems: "center",
                rowGap: "0.4em",
                background: "gray",
                borderRadius: "12px",
                padding: "0.5em 1em"
            }}>
                <header>Node info</header>
                {
                    RenderFlatNodeInfo(selectedNode)
                }
            </div>}

        </div>
    </div>



}