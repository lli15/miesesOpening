var upperHP, upperATK, upperDEF, upperSPE, upperSPD, upperSPA;
var lowerHP, lowerATK, lowerDEF, lowerSPE, lowerSPD, lowerSPA;
upperHP = 200, upperATK = 200, upperDEF = 200, upperSPE = 200, upperSPD = 200, upperSPA = 200;
lowerHP = 100, lowerATK = 100, lowerDEF = 100, lowerSPE = 100, lowerSPD = 100, lowerSPA = 100;
var upper = [
	{ axis: "HP", value: upperHP },
	{ axis: "Atk", value: upperATK },
	{ axis: "Def", value: upperDEF },
	{ axis: "Speed", value: upperSPE },
	{ axis: "SpDef", value: upperSPD },
	{ axis: "SpAtk", value: upperSPA }
]

var lower = [
	{ axis: "HP", value: lowerHP },
	{ axis: "Atk", value: lowerATK },
	{ axis: "Def", value: lowerDEF },
	{ axis: "Speed", value: lowerSPE },
	{ axis: "SpDef", value: lowerSPD },
	{ axis: "SpAtk", value: lowerSPA }
]

var RadarChart = {
	draw: function (id, lower, upper) {
		var cfg = {
			radius: 5,
			w: 500,
			h: 500,
			factor: 1,
			factorLegend: .85,
			levels: 6,
			maxValue: 0.6,
			radians: 2 * Math.PI,
			opacityArea: 0.5,
			ToRight: 5,
			TranslateX: 80,
			TranslateY: 30,
			ExtraWidthX: 100,
			ExtraWidthY: 100,
			color: d3.scaleOrdinal(d3.schemeCategory10),
			maxValue: 300
		};

		var allAxis = (lower.map(function (i, j) { return i.axis }));
		var total = allAxis.length;
		var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
		var Format = d3.format('');
		d3.select(id).select("svg").remove();

		var g = d3.select(id)
			.append("svg")
			.attr("width", cfg.w + cfg.ExtraWidthX)
			.attr("height", cfg.h + cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
		;

		//Circular segments
		for (var j = 0; j < cfg.levels; j++) {
			var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
			g.selectAll(".levels")
				.data(allAxis)
				.enter()
				.append("svg:line")
				.attr("x1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
				.attr("y1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
				.attr("x2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total)); })
				.attr("y2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total)); })
				.style("stroke", "grey")
				.style("stroke-opacity", "0.75")
				.style("stroke-width", "0.3px")
				.attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
		}

		//Text indicating at what % each level is
		for (var j = 0; j < cfg.levels; j++) {
			var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
			g.selectAll(".levels")
				.data([1]) //dummy data
				.enter()
				.append("svg:text")
				.attr("x", function (lower) { return levelFactor * (1 - cfg.factor * Math.sin(0)); })
				.attr("y", function (lower) { return levelFactor * (1 - cfg.factor * Math.cos(0)); })
				.style("font-family", "sans-serif")
				.style("font-size", "10px")
				.attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
				.attr("fill", "#737373")
				.text(Format((j + 1) * cfg.maxValue / cfg.levels));
		}

		var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")

		axis.append("line")
			.attr("x1", cfg.w / 2)
			.attr("y1", cfg.h / 2)
			.attr("x2", function (lower, i) { return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
			.attr("y2", function (lower, i) { return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
			.style("stroke", "grey")
			.style("stroke-width", "1px");

		axis.append("text")
			.text(function (lower) { return lower })
			.style("font-family", "sans-serif")
			.style("font-size", "11px")
			.attr("text-anchor", "middle")
			.attr("dy", "1.5em")
			.attr("transform", function (lower, i) { return "translate(0, -10)" })
			.attr("x", function (lower, i) { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); })
			.attr("y", function (lower, i) { return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total); });


		dataValues = [];
		g.selectAll(".nodes")
			.data(lower, function (j, i) {
				dataValues.push([
					cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
					cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
				]);
			});
		g.selectAll(".area")
			.data([dataValues])
			.enter()
			.append("polygon")
			.style("stroke-width", "2px")
			.style("stroke", cfg.color(0))
			.attr("points", function (lower) {
				var str = "";
				for (var pti = 0; pti < lower.length; pti++) {
					str = str + lower[pti][0] + "," + lower[pti][1] + " ";
				}
				return str;
			})
			.style("fill-opacity", 0.3)

			dataValues = [];
			g.selectAll(".nodes")
				.data(upper, function (j, i) {
					dataValues.push([
						cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
						cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
					]);
				});
			g.selectAll(".area")
				.data([dataValues])
				.enter()
				.append("polygon")
				.style("stroke-width", "2px")
				.style("stroke", cfg.color(0))
				.attr("points", function (upper) {
					var str = "";
					for (var pti = 0; pti < upper.length; pti++) {
						str = str + upper[pti][0] + "," + upper[pti][1] + " ";
					}
					return str;
				})
				.style("fill-opacity", cfg.opacityArea)
				.style("fill", function (j, i) { return cfg.color(0) })
	}
};


function update() {
	RadarChart.draw("#chart", lower, upper)
};

d3.select("button").on("click", update);

RadarChart.draw("#chart", lower, upper);


for (let i = 0; i < lower.length; i++){
  ax = d3.select("#slider")
    .append('div')
    .attr('id',lower[i]["axis"]);
  valdiv = ax.append('div')
    .attr('id','value-'+lower[i]["axis"])
  valdiv.append('h')
    .text(lower[i]["axis"])
  valdiv.append('p')
    .attr('id','value-'+lower[i]["axis"]);
  ax.append('div')
    .attr('class','col-sm')
    .attr('id','slider-'+lower[i]["axis"]);

  var sliderRange = d3
    .sliderBottom()
    .min(0)
    .max(255)
    .width(300)
    .tickFormat(d3.format('d'))
    .ticks(5)
    .default([100, 200])
    .fill('#2196f3')
    .on('onchange', val => {
			d3.select('p#value-'+lower[i]["axis"]).text(val.map(d3.format('d')).join('-'));
			lower[i]["value"] = val[0]
			upper[i]["value"] = val[1]
			update()
    });

  var gRange = d3
    .select('div#slider-'+lower[i]["axis"])
    .append('svg')
    .attr('width', 400)
    .attr('height', 100)
    .attr('x',50)
    .attr('y',50)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gRange.call(sliderRange);

  d3.select('p#value-'+lower[i]["axis"]).text(
    sliderRange
      .value()
      .map(d3.format('d'))
      .join('-')
  );
};