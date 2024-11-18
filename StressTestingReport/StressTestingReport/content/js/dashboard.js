/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.36990363232023, "KoPercent": 0.6300963676797627};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5645624103299857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2388888888888889, 500, 1500, "https://www.tradeoxy.com/-10"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/pattern/stock/dragDoji.json?interval=15&market=stock&id=dragDoji"], "isController": false}, {"data": [0.9777777777777777, 500, 1500, "https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/pattern/crypto/shootStar.json?interval=15&market=crypto&id=shootStar"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://www.tradeoxy.com/-11"], "isController": false}, {"data": [0.6444444444444445, 500, 1500, "https://api.tradeoxy.com/api/tradeoxy/marketstatus"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.tradeoxy.com/"], "isController": false}, {"data": [0.9777777777777777, 500, 1500, "https://api.tradeoxy.com/api/tradeoxy/market/shootStar/all?market=crypto&interval=15"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.95, 500, 1500, "https://www.tradeoxy.com/_next/static/css/8ed86fb4f9d82b97.css"], "isController": false}, {"data": [0.12222222222222222, 500, 1500, "https://www.tradeoxy.com/-7"], "isController": false}, {"data": [0.1388888888888889, 500, 1500, "https://www.tradeoxy.com/-8"], "isController": false}, {"data": [0.18333333333333332, 500, 1500, "https://www.tradeoxy.com/-9"], "isController": false}, {"data": [0.32222222222222224, 500, 1500, "https://www.tradeoxy.com/-3"], "isController": false}, {"data": [0.1388888888888889, 500, 1500, "https://www.tradeoxy.com/-4"], "isController": false}, {"data": [0.13333333333333333, 500, 1500, "https://www.tradeoxy.com/-5"], "isController": false}, {"data": [0.016666666666666666, 500, 1500, "https://www.tradeoxy.com/-6"], "isController": false}, {"data": [0.9111111111111111, 500, 1500, "https://api.tradeoxy.com/api/tradeoxy/market/rsi/all?market=forex&interval=60"], "isController": false}, {"data": [0.9777777777777777, 500, 1500, "https://api.tradeoxy.com/api/tradeoxy/market/dragDoji/all?market=stocks&interval=15"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/indicator/forex/rsi.json?interval=60&market=forex&id=rsi"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/strategy/stock/break.json?interval=15&market=stock&id=break"], "isController": false}, {"data": [0.5614525139664804, 500, 1500, "https://www.tradeoxy.com/-0"], "isController": false}, {"data": [0.09497206703910614, 500, 1500, "https://www.tradeoxy.com/-1"], "isController": false}, {"data": [0.32222222222222224, 500, 1500, "https://www.tradeoxy.com/-2"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "https://api.tradeoxy.com/api/tradeoxy/market/break/all?market=stocks&interval=15"], "isController": false}, {"data": [0.9888888888888889, 500, 1500, "https://api.tradeoxy.com/api/tradeoxy/market/updates"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2698, 17, 0.6300963676797627, 2009.0930318754615, 85, 136474, 483.0, 4462.2, 7177.699999999996, 11086.169999999996, 15.825624842359646, 1050.1816953981481, 10.856545493172339], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.tradeoxy.com/-10", 90, 0, 0.0, 2109.1000000000013, 176, 6595, 1789.0, 4232.9000000000015, 5117.750000000001, 6595.0, 2.617801047120419, 1.5952225130890052, 1.398376145287958], "isController": false}, {"data": ["https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/pattern/stock/dragDoji.json?interval=15&market=stock&id=dragDoji", 180, 0, 0.0, 184.51111111111118, 139, 686, 167.0, 218.0, 275.69999999999993, 682.76, 1.1332728921124207, 0.5201545500906618, 0.4780995013599275], "isController": false}, {"data": ["https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/pattern/crypto/shootStar.json?interval=15&market=crypto&id=shootStar", 180, 0, 0.0, 206.16666666666674, 139, 1491, 163.0, 205.8, 385.54999999999944, 1337.9099999999996, 1.1332728921124207, 0.5212612618993654, 0.4814196367860381], "isController": false}, {"data": ["https://www.tradeoxy.com/-11", 90, 1, 1.1111111111111112, 1986.0444444444447, 85, 6279, 1446.5, 4574.400000000001, 4807.35, 6279.0, 2.6531454513295207, 17.925054859309594, 1.3118330287129298], "isController": false}, {"data": ["https://api.tradeoxy.com/api/tradeoxy/marketstatus", 90, 0, 0.0, 887.0222222222222, 298, 2211, 658.5, 1500.2, 1708.8000000000006, 2211.0, 0.5621100361624124, 0.5077654135256167, 0.21408487705404378], "isController": false}, {"data": ["https://www.tradeoxy.com/", 90, 7, 7.777777777777778, 13255.16666666667, 1844, 136474, 7778.0, 11889.500000000002, 64357.65000000007, 136474.0, 0.541213400443795, 522.0375507669445, 3.6626041365992554], "isController": false}, {"data": ["https://api.tradeoxy.com/api/tradeoxy/market/shootStar/all?market=crypto&interval=15", 90, 0, 0.0, 314.4333333333334, 259, 1034, 279.0, 353.0, 600.0000000000007, 1034.0, 0.5668398677373643, 0.545804794520548, 0.21810049598488426], "isController": false}, {"data": ["Test", 90, 7, 7.777777777777778, 17724.81111111111, 5259, 141174, 12124.5, 20427.300000000003, 68666.40000000007, 141174.0, 0.5270709496061609, 514.4199257067875, 6.7231456893648796], "isController": true}, {"data": ["https://www.tradeoxy.com/_next/static/css/8ed86fb4f9d82b97.css", 90, 0, 0.0, 276.20000000000005, 149, 1117, 183.5, 507.30000000000007, 651.1, 1117.0, 0.567100603647087, 1.1773983235876044, 0.20601701616866833], "isController": false}, {"data": ["https://www.tradeoxy.com/-7", 90, 0, 0.0, 2982.211111111111, 513, 7720, 3034.5, 4850.600000000002, 7120.300000000001, 7720.0, 2.5702535983550376, 69.22365623929062, 1.3554071710075395], "isController": false}, {"data": ["https://www.tradeoxy.com/-8", 90, 2, 2.2222222222222223, 2877.866666666667, 419, 51558, 2586.0, 4393.100000000005, 5616.850000000002, 51558.0, 1.1985617259288852, 2.2696072005260355, 0.6271640697829272], "isController": false}, {"data": ["https://www.tradeoxy.com/-9", 90, 1, 1.1111111111111112, 2531.7222222222213, 344, 11233, 1915.5, 5304.1, 6237.450000000001, 11233.0, 2.601156069364162, 4.282988619942197, 1.3790699512283235], "isController": false}, {"data": ["https://www.tradeoxy.com/-3", 90, 2, 2.2222222222222223, 3140.3111111111116, 191, 76319, 1343.0, 2970.0000000000005, 3205.800000000001, 76319.0, 0.819634807158144, 3.4078700594235234, 0.42575474705159144], "isController": false}, {"data": ["https://www.tradeoxy.com/-4", 90, 0, 0.0, 3640.088888888889, 207, 9816, 3443.0, 7026.2, 8713.400000000001, 9816.0, 2.526670409882089, 348.823628754913, 1.3472285583941608], "isController": false}, {"data": ["https://www.tradeoxy.com/-5", 90, 1, 1.1111111111111112, 4440.133333333332, 211, 76279, 3271.5, 7173.700000000002, 9167.850000000002, 76279.0, 0.8519177615387529, 90.23636613591401, 0.44508450846711595], "isController": false}, {"data": ["https://www.tradeoxy.com/-6", 90, 0, 0.0, 5766.411111111111, 1269, 14108, 4690.0, 10357.900000000005, 10879.95, 14108.0, 2.511441009041188, 1154.841020551959, 1.3415607733843062], "isController": false}, {"data": ["https://api.tradeoxy.com/api/tradeoxy/market/rsi/all?market=forex&interval=60", 90, 0, 0.0, 405.6777777777778, 262, 1739, 298.0, 748.8000000000013, 1086.5000000000011, 1739.0, 0.5667042370586791, 0.5456741970115797, 0.2141743552165125], "isController": false}, {"data": ["https://api.tradeoxy.com/api/tradeoxy/market/dragDoji/all?market=stocks&interval=15", 90, 0, 0.0, 308.38888888888874, 256, 1256, 282.0, 324.00000000000006, 455.90000000000043, 1256.0, 0.5668220178863838, 0.5457876070663812, 0.2175400908489734], "isController": false}, {"data": ["https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/indicator/forex/rsi.json?interval=60&market=forex&id=rsi", 180, 0, 0.0, 222.67777777777778, 137, 1197, 166.0, 265.4000000000001, 667.0499999999993, 1180.8, 1.13309454414977, 0.5173063470605639, 0.47193830378894225], "isController": false}, {"data": ["https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/strategy/stock/break.json?interval=15&market=stock&id=break", 180, 0, 0.0, 199.27222222222215, 142, 1071, 169.0, 265.8, 277.95, 1023.2099999999998, 1.1332229490238543, 0.5184716324391365, 0.4742051109928922], "isController": false}, {"data": ["https://www.tradeoxy.com/-0", 179, 0, 0.0, 1053.0558659217882, 175, 4237, 766.0, 2326.0, 2472.0, 4164.199999999999, 4.713751514193922, 302.74234714870704, 2.372511455206194], "isController": false}, {"data": ["https://www.tradeoxy.com/-1", 179, 1, 0.5586592178770949, 3428.7877094972073, 263, 135997, 2602.0, 4053.0, 4837.0, 33666.59999999855, 1.1227779659528558, 29.335667733384142, 0.8853539416406359], "isController": false}, {"data": ["https://www.tradeoxy.com/-2", 90, 2, 2.2222222222222223, 4115.555555555556, 193, 130105, 1731.0, 3763.300000000001, 6670.500000000009, 130105.0, 0.5501390629297962, 48.30577942097864, 0.28681729270454476], "isController": false}, {"data": ["https://api.tradeoxy.com/api/tradeoxy/market/break/all?market=stocks&interval=15", 90, 0, 0.0, 328.1777777777778, 260, 1522, 284.0, 382.6, 398.45, 1522.0, 0.5667970299835629, 0.5457635464490166, 0.21586996259139601], "isController": false}, {"data": ["https://api.tradeoxy.com/api/tradeoxy/market/updates", 90, 0, 0.0, 324.4888888888889, 270, 797, 288.5, 404.9, 473.6, 797.0, 0.5667470607867708, 0.5280045859283002, 0.2003539414109483], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, 41.1764705882353, 0.25945144551519644], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, 17.647058823529413, 0.1111934766493699], "isController": false}, {"data": ["Assertion failed", 7, 41.1764705882353, 0.25945144551519644], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2698, 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "Assertion failed", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.tradeoxy.com/-11", 90, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.tradeoxy.com/", 90, 7, "Assertion failed", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.tradeoxy.com/-8", 90, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.tradeoxy.com/-9", 90, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.tradeoxy.com/-3", 90, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.tradeoxy.com/-5", 90, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.tradeoxy.com/-1", 179, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.tradeoxy.com/-2", 90, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
