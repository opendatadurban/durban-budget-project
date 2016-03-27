var pieChart = (function() {
  return function(selector, data) {
    function arcTween(outerRadius, delay) {
      return function() {
        d3.select(this)
          .transition()
          .delay(delay)
          .attrTween("d", function(d) {
            var i = d3.interpolate(d.outerRadius, outerRadius);
            return function(t) {
              d.outerRadius = i(t);
              return arc(d);
            };
          });
      };
    }

    var width = 500,
      height = 500;

    var outerRadius = height / 2 - 20,
      innerRadius = outerRadius / 2,
      cornerRadius = 10;

    var pie = d3.layout.pie()
      .padAngle(0.01)
      .value(function(d) {
        return d[1];
      });

    var arc = d3.svg.arc()
      .padRadius(outerRadius)
      .innerRadius(innerRadius);

    var svg = d3.select(selector)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    function getBB(selection) {
      selection.each(function(d) {
        d.bbox = this.getBBox();
      });
    }

    var group = svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "segment")
      .on("mouseover", function() {
        var sel = d3.select(this);
        sel.each(function() {
          this.parentNode.appendChild(this);
        });
        arcTween(outerRadius, 0);
      })
      .on("mouseout", arcTween(outerRadius - 20, 150));

    group.append("path")
      .each(function(d) {
        d.outerRadius = outerRadius - 20;
      })
      .attr("d", arc);

    var textGroup = group.append("g")
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
      });

    textGroup.append("text")
      .attr("class", "text")
      .attr("dy", ".35em")
      .text(function(d) {
        return d.data[0] + " - R" + d.data[1] + "K";
      })
      .call(getBB);

    textGroup.insert("rect", "text")
      .attr("x", function(d) {
        return d.bbox.x - 4;
      })
      .attr("y", function(d) {
        return d.bbox.y - 4;
      })
      .attr("width", function(d) {
        return d.bbox.width + 8;
      })
      .attr("height", function(d) {
        return d.bbox.height + 8;
      });
  };
})();
