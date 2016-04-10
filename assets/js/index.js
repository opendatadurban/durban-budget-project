var pieChart = require('./graphs').pieChart;
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
      return [val.title, val.expenditure];
    });
    var revenue = _.map(response.results, function(val) {
      return [val.title, val.revenue];
    });

    pieChart(".chart", Rx.Observable.create(function(observer) {
      observer.next(expenditure);
      setTimeout(function() {
        observer.next(revenue);
      }, 2000);
    }));
  })
  .then(function(data) {}, function(error) {
    console.log(error);
  });
