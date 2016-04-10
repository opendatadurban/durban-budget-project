var PieChart = require('./graphs').PieChart;
var Section = require('./graphs').Section;
var _ = require('lodash');
require('expose?$!expose?jQuery!jquery');
var Rx = require('rxjs');
require("bootstrap-webpack");

Promise.resolve($.ajax("/api/budget/sections.json", {
    data: {
      year: "2014/2015"
    }
  }))
  .then(function(response) {
    var expenditure = _.map(response.results, function(val) {
      return new Section(val.title, val.expenditure);
    });
    var revenue = _.map(response.results, function(val) {
      return new Section(val.title, val.revenue);
    });
    
    var pieChart = new PieChart(".chart");
    pieChart.updateData(expenditure);
    setTimeout(function() {
      pieChart.updateData(revenue);
    }, 2000);
  })
  .then(function(data) {}, function(error) {
    console.error(error);
  });
