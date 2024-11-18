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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7419354838709677, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://www.tradeoxy.com/-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/pattern/stock/dragDoji.json?interval=15&market=stock&id=dragDoji"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/pattern/crypto/shootStar.json?interval=15&market=crypto&id=shootStar"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.tradeoxy.com/-11"], "isController": false}, {"data": [0.5, 500, 1500, "https://api.tradeoxy.com/api/tradeoxy/marketstatus"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.tradeoxy.com/"], "isController": false}, {"data": [1.0, 500, 1500, "https://api.tradeoxy.com/api/tradeoxy/market/shootStar/all?market=crypto&interval=15"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://www.tradeoxy.com/_next/static/css/8ed86fb4f9d82b97.css"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.tradeoxy.com/-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.tradeoxy.com/-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.tradeoxy.com/-9"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.tradeoxy.com/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.tradeoxy.com/-4"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.tradeoxy.com/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.tradeoxy.com/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://api.tradeoxy.com/api/tradeoxy/market/rsi/all?market=forex&interval=60"], "isController": false}, {"data": [1.0, 500, 1500, "https://api.tradeoxy.com/api/tradeoxy/market/dragDoji/all?market=stocks&interval=15"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/indicator/forex/rsi.json?interval=60&market=forex&id=rsi"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/strategy/stock/break.json?interval=15&market=stock&id=break"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.tradeoxy.com/-0"], "isController": false}, {"data": [0.25, 500, 1500, "https://www.tradeoxy.com/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.tradeoxy.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://api.tradeoxy.com/api/tradeoxy/market/break/all?market=stocks&interval=15"], "isController": false}, {"data": [1.0, 500, 1500, "https://api.tradeoxy.com/api/tradeoxy/market/updates"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30, 0, 0.0, 691.9666666666666, 157, 4691, 278.5, 1694.2000000000003, 3633.3499999999985, 4691.0, 3.3163829316825115, 220.7687617455229, 2.288973544936989], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.tradeoxy.com/-10", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 3.5428779069767447, 3.10569585755814], "isController": false}, {"data": ["https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/pattern/stock/dragDoji.json?interval=15&market=stock&id=dragDoji", 2, 0, 0.0, 167.0, 166, 168, 167.0, 168.0, 168.0, 168.0, 5.970149253731344, 2.7402052238805967, 2.5186567164179103], "isController": false}, {"data": ["https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/pattern/crypto/shootStar.json?interval=15&market=crypto&id=shootStar", 2, 0, 0.0, 172.0, 171, 173, 172.0, 173.0, 173.0, 173.0, 5.747126436781609, 2.6434536637931036, 2.44140625], "isController": false}, {"data": ["https://www.tradeoxy.com/-11", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 40.451776413690474, 2.976190476190476], "isController": false}, {"data": ["https://api.tradeoxy.com/api/tradeoxy/marketstatus", 1, 0, 0.0, 1355.0, 1355, 1355, 1355.0, 1355.0, 1355.0, 1355.0, 0.7380073800738007, 0.666657057195572, 0.28107702952029523], "isController": false}, {"data": ["https://www.tradeoxy.com/", 1, 0, 0.0, 4691.0, 4691, 4691, 4691.0, 4691.0, 4691.0, 4691.0, 0.21317416329140906, 206.39006208697506, 1.4564125452995098], "isController": false}, {"data": ["https://api.tradeoxy.com/api/tradeoxy/market/shootStar/all?market=crypto&interval=15", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 3.355019599303136, 1.3406467770034844], "isController": false}, {"data": ["Test", 1, 0, 0.0, 8957.0, 8957, 8957, 8957.0, 8957.0, 8957.0, 8957.0, 0.11164452383610585, 109.3674770779837, 1.4313176844925755], "isController": true}, {"data": ["https://www.tradeoxy.com/_next/static/css/8ed86fb4f9d82b97.css", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 12.815875771604938, 2.2424768518518516], "isController": false}, {"data": ["https://www.tradeoxy.com/-7", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 61.349925256264235, 1.20123861047836], "isController": false}, {"data": ["https://www.tradeoxy.com/-8", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 9.969293114973262, 2.861798128342246], "isController": false}, {"data": ["https://www.tradeoxy.com/-9", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 8.852751358695652, 2.913765285326087], "isController": false}, {"data": ["https://www.tradeoxy.com/-3", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 7.208041487068966, 0.9159482758620691], "isController": false}, {"data": ["https://www.tradeoxy.com/-4", 1, 0, 0.0, 1047.0, 1047, 1047, 1047.0, 1047.0, 1047.0, 1047.0, 0.9551098376313276, 131.8592556112703, 0.5092675501432665], "isController": false}, {"data": ["https://www.tradeoxy.com/-5", 1, 0, 0.0, 1214.0, 1214, 1214, 1214.0, 1214.0, 1214.0, 1214.0, 0.8237232289950577, 88.20113004530478, 0.43518971375617793], "isController": false}, {"data": ["https://www.tradeoxy.com/-6", 1, 0, 0.0, 1561.0, 1561, 1561, 1561.0, 1561.0, 1561.0, 1561.0, 0.6406149903907751, 294.5752922805894, 0.3422035153747598], "isController": false}, {"data": ["https://api.tradeoxy.com/api/tradeoxy/market/rsi/all?market=forex&interval=60", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 3.4636353417266186, 1.3594593075539567], "isController": false}, {"data": ["https://api.tradeoxy.com/api/tradeoxy/market/dragDoji/all?market=stocks&interval=15", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 3.414505762411348, 1.3609541223404256], "isController": false}, {"data": ["https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/indicator/forex/rsi.json?interval=60&market=forex&id=rsi", 2, 0, 0.0, 169.5, 161, 178, 169.5, 178.0, 178.0, 178.0, 5.847953216374268, 2.6698419225146197, 2.435695358187134], "isController": false}, {"data": ["https://www.tradeoxy.com/_next/data/nO2kzwheUD5AotL34lprU/strategy/stock/break.json?interval=15&market=stock&id=break", 2, 0, 0.0, 157.5, 157, 158, 157.5, 158.0, 158.0, 158.0, 6.289308176100629, 2.8774813286163523, 2.6318052279874213], "isController": false}, {"data": ["https://www.tradeoxy.com/-0", 2, 0, 0.0, 1477.0, 186, 2768, 1477.0, 2768.0, 2768.0, 2768.0, 0.6313131313131314, 40.48264628708964, 0.31781437421085856], "isController": false}, {"data": ["https://www.tradeoxy.com/-1", 2, 0, 0.0, 1132.0, 555, 1709, 1132.0, 1709.0, 1709.0, 1709.0, 1.1702750146284377, 30.727719060854298, 0.9279915155061439], "isController": false}, {"data": ["https://www.tradeoxy.com/-2", 1, 0, 0.0, 1032.0, 1032, 1032, 1032.0, 1032.0, 1032.0, 1032.0, 0.9689922480620154, 86.94812863372093, 0.5166696947674418], "isController": false}, {"data": ["https://api.tradeoxy.com/api/tradeoxy/market/break/all?market=stocks&interval=15", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 3.4512208781362004, 1.3650873655913978], "isController": false}, {"data": ["https://api.tradeoxy.com/api/tradeoxy/market/updates", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 3.2015141752577323, 1.2148303264604812], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
