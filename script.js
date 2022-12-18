var csvLoaded = false;
var predictLoaded = false
var tests = []

$(document).ready(function() {
	$.ajax({
        type: "GET",
        url: "output.csv",
        dataType: "text",
        success: function(data) {
			csvLoaded = true;
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
		x.push(parseInt(coord[0]));
		y.push(parseFloat(coord[1]));
	});

	const tester = document.getElementById('tester');
	Plotly.newPlot( tester,[{
		x: x,
		y: y}], {
		margin: { t: 0 },}
	);

	tests.push(test_csv());
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
		x.push(parseInt(coord[0]));
		y.push(parseFloat(coord[1]));
	});

	const prediction = document.getElementById('prediction');
	Plotly.newPlot( prediction,[{
		x: x,
		y: y}], {
		margin: { t: 0 },}
	);
	tests.push(test_predict());
}

function showPrediction(){
	var p = document.getElementById('prediction');
	p.style.display = 'block';	
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