let grossChart = dc.barChart('#gross');
let grossGenreChart = dc.barChart('#grossgenre');

d3.json("data/movies.json").then((data) => {
    //criando um crossfilter
    let facts = crossfilter(data);

    console.log(facts.all());

    let dateDim = facts.dimension((d) => {
        return d.Year;
    });
    
    let genreDim = facts.dimension((d) => {
        return d.Genre;
    });

    let grossGroup = dateDim.group().reduceSum((d) => {
        return d.Worldwide_Gross_M;
    });

    let grossGenreGroup = genreDim.group().reduceSum((d) => {
        return d.Worldwide_Gross_M;
    });

    const setChart = (element, options) => {
        element.width(800)
            .height(400)
            .margins({top: 50, right: 20, bottom: 40, left: 40})
            .dimension(options.dimension)
            .x(d3.scaleBand())
            .xAxisLabel(options.xLabel)
            .yAxisLabel(options.yLabel)
            .xUnits(dc.units.ordinal)
            .renderHorizontalGridLines(true)
            .barPadding(0.25)
            .brushOn(false)    
            .ordinalColors(['darkorange'])
            .group(options.group.group, options.group.label);
    }

    setChart(grossChart, 
            {
                xLabel: 'Ano',
                yLabel: 'Bilheteria (Milhões de dinheiros)',
                dimension: dateDim,
                group: {
                    group: grossGroup,
                    label: 'Bilheteria'
                }

            }
    )

    setChart(grossGenreChart, 
        {
            xLabel: 'Gênero',
            yLabel: 'Bilheteria (Milhões de dinheiros)',
            dimension: dateDim,
            group: {
                group: grossGenreGroup,
                label: 'Bilheteria'
            }

        }
)

    dc.renderAll();

});