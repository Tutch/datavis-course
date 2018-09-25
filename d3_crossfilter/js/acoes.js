let compositeChart = dc.compositeChart('#chart');

d3.csv("data/stocks.csv").then(function(data){
    // formatando nossos dados
    let parseDate = d3.timeParse("%Y/%m/%d");
    data.forEach(function(d, i){
        d.date = parseDate(d.date);
        d.tesla = +d.tesla;
        d.teslaPerc = ((d.tesla - data[0].tesla) / data[0].tesla) * 100;
        d.facebook = +d.facebook;
        d.facebookPerc = ((d.facebook - data[0].facebook) / data[0].facebook) * 100;
    });

    //criando um crossfilter
    let facts = crossfilter(data);


    let dateDim = facts.dimension((d) => {
        return d.date;
    });

    let teslaByDayGroup = dateDim.group().reduceSum((d) => {
        return d.teslaPerc;
    });

    let fbByDayGroup = dateDim.group().reduceSum((d) => {
        return d.facebookPerc;
    });

    let xScale = d3.scaleTime()
                   .domain([dateDim.bottom(1)[0].date, dateDim.top(1)[0].date]);

    compositeChart.width(800)
             .height(400)
             .margins({top: 50, right: 50, bottom: 25, left: 40})
             .dimension(dateDim)
             .x(xScale)
             .xUnits(d3.timeDays)
             .renderHorizontalGridLines(true)
             .legend(dc.legend().x(700).y(5).itemHeight(13).gap(5))
             .brushOn(false)    
             .compose([
                dc.lineChart(compositeChart)
                          .group(teslaByDayGroup, 'Tesla')
                          .ordinalColors(['steelblue']),
                dc.lineChart(compositeChart)
                          .group(fbByDayGroup, 'Facebook')
                          .ordinalColors(['darkorange'])]);

    dc.renderAll();

});