import * as $ from 'jquery';
import * as Rx from 'rxjs';
import * as d3 from 'd3';

interface PieChartArc<T> extends d3.layout.pie.Arc<T> {
  outerRadius: number;
}

function getBB(selection) {
  selection.each(function(d) {
    d.bbox = this.getBBox();
  });
};

var getElementParentDimensions = (selector) => {
  var s = $(selector).parent();
  return {
    width: s.width(),
    height: s.height()
  }
};

var observeElementParentDimensions = (selector) => {
  return Rx.Observable.create((observer) => {
    var currentDimensions = getElementParentDimensions(selector);
    observer.next(currentDimensions);
    setInterval(() => {
      var newDimensions = getElementParentDimensions(selector);
      if (newDimensions.height != currentDimensions.height ||
        newDimensions.width != currentDimensions.width) {
        observer.next(newDimensions);
        currentDimensions = newDimensions;
      }
    }, 100);
  });
}

var createGraph = (selector, dimensions, data) => {
  var width = dimensions.width;
  var height = Math.min(width, 750);
  var outerRadius = height / 2 - 20;
  var innerRadius = 10;
  var cornerRadius = 10;

  var pie = d3.layout.pie()
    .padAngle(0.01)
    .value((d) => {
    return d[1];
  });

  var arc = d3.svg.arc<number>()
    .padRadius(outerRadius.toString())
    .innerRadius(innerRadius);

  var group = <d3.Selection<PieChartArc<number>>>d3.select(selector)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .selectAll("g")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "segment")
    .on("mouseover", function() {
    var sel = d3.select(this);
    sel.each(function() {
      this.parentNode.appendChild(this);
    });
  });

  group.append("path")
    .each((d) => {
    d.outerRadius = outerRadius;
  })
    .attr("d", <any>arc);

  var textGroup = group.append("g")
    .attr("transform", function(d) {
    var centroid = arc.centroid(<any>d);
    if (centroid[0] < 0) {
      d3.select(this)
        .attr("class", "left");
    } else {
      d3.select(this)
        .attr("class", "right");
    }
    return "translate(" + centroid + ")";
  });

  textGroup.append("text")
    .attr("class", "text")
    .attr("dy", ".35em")
    .text((d) => {
    return d.data[0] + " - R" + d.data[1] + "K";
  })
    .call(getBB);

  textGroup.insert("rect", "text")
    .attr("x", (d: any) => {
    return d.bbox.x - 4;
  })
    .attr("y", (d: any) => {
    return d.bbox.y - 4;
  })
    .attr("width", (d: any) => {
    return d.bbox.width + 8;
  })
    .attr("height", (d: any) => {
    return d.bbox.height + 8;
  });
};

var updateGraphDimensions = (selector, dimensions) => {
  var width = dimensions.width;
  var height = Math.min(dimensions.height, Math.min(width, 750));
  var outerRadius = height / 2 - 20;
  var innerRadius = 10;
  var cornerRadius = 10;

  var pie = d3.layout.pie()
    .padAngle(0.01)
    .value((d) => {
    return d[1];
  });

  var arc = d3.svg.arc<number>()
    .padRadius(outerRadius.toString())
    .innerRadius(innerRadius);

  var group = d3.select(selector)
    .attr("width", width)
    .attr("height", height)
    .select("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .selectAll("g");

  group.select("path")
    .each((d) => {
    d.outerRadius = outerRadius;
  })
    .attr("d", <any>arc);

  var textGroup = group.select("g")
    .attr("transform", (d) => {
    return "translate(" + arc.centroid(d) + ")";
  });

  textGroup.select("text")
    .attr("class", "text")
    .attr("dy", ".35em")
    .text((d) => {
    return d.data[0] + " - R" + d.data[1] + "K";
  }).call(getBB);

  textGroup.select("rect")
    .attr("x", (d) => {
    return d.bbox.x - 4;
  })
    .attr("y", (d) => {
    return d.bbox.y - 4;
  })
    .attr("width", (d) => {
    return d.bbox.width + 8;
  })
    .attr("height", (d) => {
    return d.bbox.height + 8;
  });
}

var updateGraphData = (selector, dimensions, data) => {
  $(selector).html("");
  createGraph(selector, dimensions, data);
};

export function pieChart(selector, dataObservable) {
  var dimensions = getElementParentDimensions(selector);
  dataObservable.subscribe((data) => {
    updateGraphData(selector, dimensions, data);
  });
  observeElementParentDimensions(selector)
    .subscribe((dimensions) => {
    updateGraphDimensions(selector, dimensions);
  });
};
