"use strict";
var graphs_1 = require('./graphs');
require('expose?$!expose?jQuery!jquery');
require('bootstrap-webpack');
Promise.resolve($.ajax("/api/budget/sections.json", {
    data: {
        year: "2014/2015"
    }
}))
    .then(function (response) {
    var expenditure = response.results.map(function (val) {
        return new graphs_1.Section(val.title, val.expenditure);
    });
    var pieChart = new graphs_1.PieChart(".chart");
    pieChart.updateData(expenditure);
})
    .then(function (data) { }, function (error) {
    console.error(error);
});
//# sourceMappingURL=index.js.map