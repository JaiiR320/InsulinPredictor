var csvLoaded = false;
var predictLoaded = false
var tests = []

// make function to convert number to date

$(document).ready(function() {
	for (let i = 650; i < 800; i++) {
		console.log(i, toDate(i));
	}
	$.ajax({
        type: "GET",
        url: "output2.csv",
        dataType: "text",
        success: function(data) {
			csvLoaded = true;
			tests.push(test_csv());
			processData(data);
		}
	});
	$.ajax({
        type: "GET",
        url: "predict.csv",
        dataType: "text",
        success: function(data) {
			predictLoaded = true;
			processPredict(data);
		}
	});
});

function toDate(t){
	t = t-2;
	t += 0;
	var month = t % 12;
	month += 1;
	var year = 1961 + Math.floor(t/12);
	return year + "-" + month + "-01";
}

function processData(allText) {
	var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];
	
    for (var i=1; i<allTextLines.length; i++) {
		var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
			
			var tarr = [];
            for (var j=0; j<headers.length; j++) {
				tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }
	var y = []
	var x = []
	lines.forEach(coord => {
		x.push(parseInt(coord[0])+650);
		y.push(parseFloat(coord[1]));
	});

	const tester = document.getElementById('tester');
	Plotly.newPlot( tester,[{
		x: x,
		y: y}], {
		margin: { t: 0 },}
	);

	tests.push(test_plot());
}

function processPredict(allText){
	var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];
	
    for (var i=1; i<allTextLines.length; i++) {
		var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
			
			var tarr = [];
            for (var j=0; j<headers.length; j++) {
				tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }
	var y = []
	var x = []
	lines.forEach(coord => {
		x.push(parseInt(coord[0]) + 650);
		y.push(parseFloat(coord[1]));
	});
	var table = document.getElementById("table");
	for (var i = 0; i < x.length; i++) {
		var xtd = document.createElement("td");
		xtd.innerHTML = toDate(x[i]).toString();
		var ytd = document.createElement("td");
		ytd.innerHTML = y[i].toString();
		var tr = document.createElement("tr");
		tr.appendChild(xtd);
		tr.appendChild(ytd);
		table.appendChild(tr);
	}

	const prediction = document.getElementById('prediction');
	Plotly.newPlot( prediction,[{
		x: x,
		y: y}], {
		margin: { t: 0 },}
	);
	tests.push(test_predict());
}

function showPrediction(){
	var p = document.getElementById('pdiv');
	p.style.display = 'block';	
	document.getElementById('table').style.display = 'block';
	tests.push(test_showPlot(true));
	tests.push(test_button(true));
	console.table(tests, ["Test_Case", "Input", "Exp", "Observed"]);
}

function test_csv(){
	const testCase = "load CSV";
	const input = "./output.csv";
	const expected = "csv loaded, ajax success function ran";
	const observed = csvLoaded;
	return {Test_Case:testCase, Input:input, Exp:expected, Observed:observed}
}

function test_predict(){
	const testCase = "load predictions";
	const input = "./predict.csv";
	const expected = "predictions loaded, success function ran";
	const observed = predictLoaded;
	return {Test_Case:testCase, Input:input, Exp:expected, Observed:observed}
}

function test_plot(){
	output = false
	// test if the plot exists
	const plot = document.getElementsByClassName('plot-container');
	if(plot){
		output = true;
	}
	const testCase = "create plot";
	const input = "document.getElementsByClassName('plot-container')";
	const expected = "Plot exists (classname found)";
	const observed = output;
	return {Test_Case:testCase, Input:input, Exp:expected, Observed:observed}
}

function test_button(btnClicked){
	const testCase = "button click";
	const input = "showPrediction()";
	const expected = "Button was clicked";
	const observed = btnClicked;
	return {Test_Case:testCase, Input:input, Exp:expected, Observed:observed}
}

function test_showPlot(checked){
	const testCase = "show plot";
	const input = "document.getElementById('pred').style";
	const expected = "Style is set to \"display: block\"";
	const observed = checked;
	return {Test_Case:testCase, Input:input, Exp:expected, Observed:observed}
}