import { PieChart, Section } from './graphs';
import 'expose?$!expose?jQuery!jquery';
import * as Rx from 'rxjs';
import 'bootstrap-webpack';

var expenditureChart = new PieChart(".chart-expenditure");
var revenueChart = new PieChart(".chart-revenue");
Promise.resolve($.ajax("/api/budget/sections.json", {
  data: {
    year: "2014/2015"
  }
})).then(function(response) {
  var expenditure = response.results.map((val) => {
    return new Section(val.title, val.expenditure);
  });
  var revenue = response.results.map((val) => {
    return new Section(val.title, val.revenue);
  });

  expenditureChart.updateData(expenditure);
  revenueChart.updateData(revenue);
});
