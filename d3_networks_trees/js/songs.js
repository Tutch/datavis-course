const width = 960;
const height = 800;

// Create svg element inside #vis element and attribute it to the vis variable
let vis = d3.select('#vis')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [-width / 2, -height / 2, width, height]);

// Read the contents of data/songs.json file and process it as a graph variable
d3.json('data/songs.json').then(graph => {
    // Set the nodes and links
    const nodes = graph.nodes;
    const links = graph.links;
    
    // create simulation constant using the forceSimulation function defined down below
    const simulation = forceSimulation(nodes, links).on('tick', ticked);

    // create link svg elements
    const link = vis.append('g')
                    .selectAll('line')
                    .data(links)
                    .enter()
                    .append('line')
                    .attr('class', 'link');

    // create node svg elements
    const countExtent = d3.extent(nodes, d => { return d.playcount });

    let circleRadius = d3.scaleSqrt()
                        .range([2,20])
                        .domain(countExtent);

    const node = vis.append('g')
                    .selectAll('cirlce')
                    .data(nodes)
                    .enter()
                    .append('circle')
                    .attr('class', 'node')
                    .attr('r', d => { return circleRadius(d.playcount)})
                    .call(drag(simulation));

    node.append('title')
        .text(d => { return `${d.artist} - ${d.name}`;})

    // define function ticked
    function ticked() {
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('cx', d => d.x)
            .attr('cy', d => d.y)
    }

    // define function drag
    function drag(simulation){
        function dragstarted(d) {
            if (!d3.event.active) {
                simulation.alphaTarget(0.3)
                        .restart();
            }

            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if(!d3.event.active) {
                simulation.alphaTarget(0);
            }
        
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
    }

    // define the forceSimulation function that will receive nodes and links and 
    // will return a d3.forceSimulation() object 
    function forceSimulation(nodes, links) {
        return d3.forceSimulation(nodes)
                 .force('link', d3.forceLink(links).id(d => d.id).distance(50))
                 .force('charge', d3.forceManyBody().strength(-50).distanceMax(270))
                 .force('center', d3.forceCenter());
    }
});

