import * as $ from 'jquery';
import * as Rx from 'rxjs';
import * as d3 from 'd3';

export class Section {
  title: string;
  amount: number;
  constructor(title: string, amount: number) {
    this.title = title;
    this.amount = amount;
  }
}

interface GraphDimensions {
  width: number;
  height: number;
}

interface PieChartArc<T> extends d3.layout.pie.Arc<T> {
  outerRadius: number;
}

export class PieChart {
  private element: JQuery;
  private dimensions: GraphDimensions;
  private data: Section[];

  constructor(selector: string) {
    this.element = $(selector);
    this.dimensions = this.getElementParentDimensions(selector);
    this.observeElementParentDimensions(selector)
      .subscribe((dimensions) => {
        this.element.html("");
        this.createGraph();
      });
  }

  public updateData = (data: Array<Section>) => {
    this.data = data;
    this.element.html("");
    this.createGraph();
  }

  private createGraph() {
    if (this.data == null) return;
    var width = this.dimensions.width;
    var height = Math.min(width, 750);
    var outerRadius = height / 2 - 20;
    var innerRadius = 10;
    var cornerRadius = 10;

    var pie = d3.layout.pie<Section>()
      .padAngle(0.01)
      .value((d) => {
        return d.amount;
      });

    var arc = d3.svg.arc()
      .padRadius(outerRadius.toString())
      .innerRadius(innerRadius);

    var group = <d3.Selection<PieChartArc<Section>>>d3.select(this.element.selector)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
      .selectAll("g")
      .data(pie(this.data))
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
        return d.data.title + " - R" + d.data.amount + "K";
      })
      .call(this.getBB);

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
  }

  private getElementParentDimensions = (selector): GraphDimensions => {
    var s = this.element.parent();
    return {
      width: s.width(),
      height: s.height()
    }
  }

  private observeElementParentDimensions = (selector): Rx.Observable<GraphDimensions> => {
    return Rx.Observable.create((observer) => {
      $(window).resize(() => {
        var newDimensions = this.getElementParentDimensions(selector);
        this.dimensions = newDimensions;
        setTimeout(() => {
          observer.next(newDimensions);
        }, 50);
      });
      this.dimensions = this.getElementParentDimensions(selector);
      observer.next(this.dimensions);
    });
  }

  private getBB(selection) {
    selection.each(function(d) {
      d.bbox = this.getBBox();
    });
  };
}
