const scatterPlot = (data, x_obj, y_obj, label_field) => {
    console.log('!');
    let margin = {top: 50, right: 50, bottom: 50, left: 50};
    let width = 1800 - margin.left - margin.right;
    let height = 800 - margin.top - margin.bottom;

    let svg = d3.select('#chart')
                .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

    const createScale = (dataset, field, minmax, inverted) => {
        let range = inverted ? [minmax[1], minmax[0]] : [minmax[0], minmax[1]];
        console.log(range);

        return d3.scaleLinear()
                .domain([minmax[0], d3.max(dataset, (d) => { 
                                                    return d[field];
                                                })
                ])
                .range(range);
    }

    let xScale = createScale(data, x_obj.field, [0, width], false);
    let yScale = createScale(data, y_obj.field, [0, height], true);

    let xAxis = d3.axisBottom()
                  .scale(xScale)
                  .ticks(5);

    let yAxis = d3.axisLeft()
                  .scale(yScale)
                  .ticks(10);

    svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
                .attr('cx', (d) => {
                    return xScale(d[x_obj.field]);
                })
                .attr('cy', (d) => {
                    return yScale(d[y_obj.field]);
                })
                .attr('r', 5);

    const addLabels = (x_f, y_f, l_f) => {
        svg.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr('x', (d) => {
                return xScale(d[x_f])+10;
            })    
            .attr('y', (d) => {
                return yScale(d[y_f]);
            })
            .text((d) => {
                return d[l_f];
            })
    }

    addLabels(x_obj.field, y_obj.field, label_field);

    // Eixo X
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    svg.append('text')
        .attr('transform', `translate(${width/2},${height + margin.bottom})`)
        .style('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text(x_obj.axis_text);
    
    // Eixo Y
    svg.append('g')
        .attr('transform', `translate(0,0)`)
        .call(yAxis);

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text(y_obj.axis_text);
}

d3.json('data/movies.json').then((json) => {
    scatterPlot(json, 
                {field: 'Worldwide_Gross_M', axis_text:'Bilheteria (Milhões)'},
                {field: 'Budget_M', axis_text:'Orçamento (Milhões)'}, 
                'Film'
    );
})









//  // Primeiro definimos o objeto margin
//  let margin = {top: 50, right: 50, bottom: 50, left: 50};
    
//  // Depois definimos w e h como as dimensões internas
//  // da área do gráfico (área útil)
//  let w = 800 - margin.left - margin.right;
//  let h = 200 - margin.top - margin.bottom;

//  // Depois um elemento g no svg que vai transladar a origem 
//  // do gráfico como sendo a origem da área útil do gráfico

//  let svg = d3.select('#chart')
//          .append('svg')
//              .attr('width', w + margin.left + margin.right)
//              .attr('height', h + margin.top + margin.bottom)
//          .append('g')
//              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//  let dataset = [];
//  let numDataPoints = 50;
//  let xRange = Math.random() * 1000;
//  let yRange = Math.random() * 1000;

//  for (let i=0; i < numDataPoints; i++) {
//      let newNumber1 = Math.floor(Math.random() * xRange);
//      let newNumber2 = Math.floor(Math.random() * yRange);
//      dataset.push([newNumber1, newNumber2]);
//  }

//  // Agora todo o código pode ignorar as margens. 
//  // Copie aqui o código de criação das escalas do arquivo
//  // anterior (vai continuar o mesmo)
//  const createScale = (dataset, index, minmax, inverted) => {
//      let range = inverted ? [minmax[1], minmax[0]] : [minmax[0], minmax[1]];
//      console.log(range);

//      return d3.scaleLinear()
//                 .domain([minmax[0], d3.max(dataset, (d) => { 
//                                                  return d[index];
//                                              })
//                 ])
//                 .range(range);
//  }

//  let xScale = createScale(dataset, 0, [0,w], false);
//  let yScale = createScale(dataset, 1, [0,h], true);

//  // Eixos
//  let xAxis = d3.axisBottom()
//                .scale(xScale)
//                .ticks(5);

//  let yAxis = d3.axisLeft()
//                .scale(yScale)
//                .ticks(10);


//  // Depois adicione os elementos círculos
//  svg.selectAll('circle')
//          .data(dataset)
//          .enter()
//          .append('circle')
//          .attr('cx', (d) => {
//              return xScale(d[0]);
//          })
//          .attr('cy', (d) => {
//              return yScale(d[1]);
//          })
//          .attr('r', 5);

//  // Depois adicione os labels
//  const addLabels = () => {
//      svg.selectAll('text')
//          .data(dataset)
//          .enter()
//          .append('text')
//          .attr('x', (d) => {
//              return xScale(d[0]);
//          })    
//          .attr('y', (d) => {
//              return yScale(d[1]);
//          })
//          .attr('font-family', 'sans-serif')
//          .attr('font-size', '11px')
//          .attr('fill', 'red')
//          .text((d) => {
//              return `${d[0]},${d[1]}`;
//          })
//  }

//  //addLabels();

//  // Eixo X
//  svg.append('g')
//     .attr('transform', `translate(0,${h})`)
//     .call(xAxis);

//  svg.append('text')
//     .attr('transform', `translate(${w/2},${h + margin.bottom})`)
//     .style('text-anchor', 'middle')
//     .attr('font-family', 'sans-serif')
//     .attr('font-size', '12px')
//     .text('Eixo X');
 
//  // Eixo Y
//  svg.append('g')
//     .attr('transform', `translate(0,0)`)
//     .call(yAxis);

//  svg.append('text')
//     .attr('transform', 'rotate(-90)')
//     .attr('y', 0 - margin.left)
//     .attr('x', 0 - (h / 2))
//     .attr('dy', '1em')
//     .style('text-anchor', 'middle')
//     .attr('font-family', 'sans-serif')
//     .attr('font-size', '12px')
//     .text('Eixo Y');