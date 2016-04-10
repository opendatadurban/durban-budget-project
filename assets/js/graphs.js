"use strict";
var $ = require('jquery');
var Rx = require('rxjs');
var d3 = require('d3');
function getBB(selection) {
    selection.each(function (d) {
        d.bbox = this.getBBox();
    });
}
;
var getElementParentDimensions = function (selector) {
    var s = $(selector).parent();
    return {
        width: s.width(),
        height: s.height()
    };
};
var observeElementParentDimensions = function (selector) {
    return Rx.Observable.create(function (observer) {
        var currentDimensions = getElementParentDimensions(selector);
        observer.next(currentDimensions);
        setInterval(function () {
            var newDimensions = getElementParentDimensions(selector);
            if (newDimensions.height != currentDimensions.height ||
                newDimensions.width != currentDimensions.width) {
                observer.next(newDimensions);
                currentDimensions = newDimensions;
            }
        }, 100);
    });
};
var createGraph = function (selector, dimensions, data) {
    var width = dimensions.width;
    var height = Math.min(width, 750);
    var outerRadius = height / 2 - 20;
    var innerRadius = 10;
    var cornerRadius = 10;
    var pie = d3.layout.pie()
        .padAngle(0.01)
        .value(function (d) {
        return d[1];
    });
    var arc = d3.svg.arc()
        .padRadius(outerRadius.toString())
        .innerRadius(innerRadius);
    var group = d3.select(selector)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .selectAll("g")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "segment")
        .on("mouseover", function () {
        var sel = d3.select(this);
        sel.each(function () {
            this.parentNode.appendChild(this);
        });
    });
    group.append("path")
        .each(function (d) {
        d.outerRadius = outerRadius;
    })
        .attr("d", arc);
    var textGroup = group.append("g")
        .attr("transform", function (d) {
        var centroid = arc.centroid(d);
        if (centroid[0] < 0) {
            d3.select(this)
                .attr("class", "left");
        }
        else {
            d3.select(this)
                .attr("class", "right");
        }
        return "translate(" + centroid + ")";
    });
    textGroup.append("text")
        .attr("class", "text")
        .attr("dy", ".35em")
        .text(function (d) {
        return d.data[0] + " - R" + d.data[1] + "K";
    })
        .call(getBB);
    textGroup.insert("rect", "text")
        .attr("x", function (d) {
        return d.bbox.x - 4;
    })
        .attr("y", function (d) {
        return d.bbox.y - 4;
    })
        .attr("width", function (d) {
        return d.bbox.width + 8;
    })
        .attr("height", function (d) {
        return d.bbox.height + 8;
    });
};
var updateGraphDimensions = function (selector, dimensions) {
    var width = dimensions.width;
    var height = Math.min(dimensions.height, Math.min(width, 750));
    var outerRadius = height / 2 - 20;
    var innerRadius = 10;
    var cornerRadius = 10;
    var pie = d3.layout.pie()
        .padAngle(0.01)
        .value(function (d) {
        return d[1];
    });
    var arc = d3.svg.arc()
        .padRadius(outerRadius.toString())
        .innerRadius(innerRadius);
    var group = d3.select(selector)
        .attr("width", width)
        .attr("height", height)
        .select("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .selectAll("g");
    group.select("path")
        .each(function (d) {
        d.outerRadius = outerRadius;
    })
        .attr("d", arc);
    var textGroup = group.select("g")
        .attr("transform", function (d) {
        return "translate(" + arc.centroid(d) + ")";
    });
    textGroup.select("text")
        .attr("class", "text")
        .attr("dy", ".35em")
        .text(function (d) {
        return d.data[0] + " - R" + d.data[1] + "K";
    }).call(getBB);
    textGroup.select("rect")
        .attr("x", function (d) {
        return d.bbox.x - 4;
    })
        .attr("y", function (d) {
        return d.bbox.y - 4;
    })
        .attr("width", function (d) {
        return d.bbox.width + 8;
    })
        .attr("height", function (d) {
        return d.bbox.height + 8;
    });
};
var updateGraphData = function (selector, dimensions, data) {
    $(selector).html("");
    createGraph(selector, dimensions, data);
};
function pieChart(selector, dataObservable) {
    var dimensions = getElementParentDimensions(selector);
    dataObservable.subscribe(function (data) {
        updateGraphData(selector, dimensions, data);
    });
    observeElementParentDimensions(selector)
        .subscribe(function (dimensions) {
        updateGraphDimensions(selector, dimensions);
    });
}
exports.pieChart = pieChart;
;
//# sourceMappingURL=graphs.js.map