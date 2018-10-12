const width = 960;
const height = 800;

// Create svg element inside #vis element and attribute it to the vis variable
let vis = d3.select('#vis')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [-width / 2, -height / 2, width, height]);

// Read the contents of data/songs.json file and process it as a graph variable
d3.json('data/lesmiserables.json').then(graph => {
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
    let connections = {};

    links.forEach(l => {
        if(!connections[l['source'].id]) {
            connections[l['source'].id] = 1;
        }else {
            connections[l['source'].id] += 1;
        }
        
        if (!connections[l['target'].id]) {
            connections[l['target'].id] = 1;
        }else {
            connections[l['target'].id] += 1;
        }
    });

    var color = d3.scaleLinear()
    .domain([Math.min(...Object.values(connections)), Math.max(...Object.values(connections))])
    .range(['red', 'blue']);


    console.log(connections);

    const node = vis.append('g')
                    .selectAll('circle')
                    .data(nodes)
                    .enter()
                    .append('circle')
                    .attr('fill', d => { return color(connections[d.id])})
                    .attr('class', 'node')
                    .attr('r', d => { return connections[d.id];})
                    .call(drag(simulation));

    node.append('title')
        .text(d => { return `${d.id} - ${connections[d.id]}`;})
    

    // define function ticked
    function ticked() {
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('cx', d => d.x)
            .attr('cy', d => d.y)
    }
    
    //define function drag
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