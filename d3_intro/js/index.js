const GROSS = 'Worldwide_Gross_M';
const BUDGET = 'Budget_M';

// --------------------------------------------------------------
const sortByFieldAsc = (movie1, movie2, field) => {
    return movie1[field] - movie2[field];
}

const sortByFieldDesc = (movie1, movie2, field) => {
    return movie2[field] - movie1[field];
}

const rentabilityCalc = (movie) => {
    return movie[GROSS] - movie[BUDGET];
};
// --------------------------------------------------------------
const aggregateGenre = (data) => {
    let objData = data.reduce((acc, obj) => { 
        if(!acc[obj['Genre']]) {
            acc[obj['Genre']] = { 'Genre': obj['Genre'],
                                  'Worldwide_Gross_M': obj[GROSS], 
                                  'Budget_M': obj[BUDGET]};
          return acc;
        } else {
            acc[obj['Genre']][BUDGET] += obj[BUDGET];
            acc[obj['Genre']][GROSS] += obj[GROSS];
          return acc;
        }
    }, {});

    returnArr = [];

    for(genre in objData) {
        returnArr.push(objData[genre]);
    }

    return returnArr;
}
// --------------------------------------------------------------
const render = (data, graph_selector, field, options={}) => {
    if(options.sortFunc) {
        if(typeof field === 'function') {
            data.sort((a,b) => {
                return field(b) - field(a);
            });
        }else {
            data.sort((a,b) => {
                return options.sortFunc(a,b, field);
            });
        }
    }

    let label = options.labelBy ? options.labelBy : 'Film';
    let factor = options.factor ? options.factor : 1;
    let bar_color = options.bar_color ? options.bar_color : 'grey';

    let divs = d3.select(graph_selector)
                    .selectAll('div.bar')
                    .data(data)
                    .enter().append('div');

    divs.attr('class', 'bar')
        .style('background-color', bar_color)
        .append('span');

    divs.attr('class', 'bar')
        .style('width', function (d) {
            if(typeof field === 'function') {
               return `${field(d)*factor}px`;
            }
            return `${d[field]*factor}px`;
        })
        .select('span')
            .text(function (d) {
                console.log(d);
                return d[label];
            });

    divs.append('span')
        .attr('class','legend')
        .text((d) => {
            if(typeof field === 'function') {
                   return `${field(d)}M`;
                }
                return `${d[field]}M`;
            }
        )
        .style('position', 'absolute')
        .style('right', '0')
        .style('left', (d) => {
            if(typeof field === 'function') {
                   return `${field(d)*factor+40}px`;
                }
                return `${d[field]*factor+40}px`;
            }
        );
    
};
// --------------------------------------------------------------
d3.json('data/movies.json').then((json) => {
    render(json, '#gross_graph', GROSS, 
        {bar_color: 'lightblue', factor: 0.333, sortFunc: sortByFieldDesc}
    );
    render(json, '#budget_graph', BUDGET, 
        {bar_color: 'lightcoral', factor: 2.5, sortFunc: sortByFieldDesc}
    );
    render(json, '#rentability_graph', rentabilityCalc, 
        {bar_color: 'lightgreen', factor: 0.5, sortFunc: sortByFieldDesc}
    );
   
    let aggregateData = aggregateGenre(json);
    console.log(aggregateData);
    render(aggregateData, '#gross_genre_graph', GROSS, 
        {labelBy:'Genre', bar_color: 'lightpink', factor:0.1, sortFunc: sortByFieldDesc}
    );
});