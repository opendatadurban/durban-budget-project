import { PieChart, Section } from './graphs';
import 'expose?$!expose?jQuery!jquery';
import * as Rx from 'rxjs';
import 'bootstrap-webpack';

Promise.resolve($.ajax("/api/budget/sections.json", {
  data: {
    year: "2014/2015"
  }
}))
  .then(function(response) {
  var expenditure = response.results.map((val) => {
    return new Section(val.title, val.expenditure);
  });

  var pieChart = new PieChart(".chart");
  pieChart.updateData(expenditure);
})
  .then(function(data) { }, function(error) {
  console.error(error);
});
