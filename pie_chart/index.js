const width = 450,
  height = 450,
  margin = 40;

const radius = Math.min(width, height) / 2 - margin;

const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

const data1 = { a: 9, b: 20, c: 30, d: 8, e: 12 };
const data2 = { a: 6, b: 16, c: 20, d: 14, e: 19, f: 12 };

const color = d3
  .scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f"])
  .range(d3.schemeDark2);

function update(data) {
  const pie = d3
    .pie()
    .value(function (d) {
      return d[1];
    })
    .sort(function (a, b) {
      return d3.ascending(a.key, b.key);
    });
  const data_ready = pie(Object.entries(data));
  const u = svg.selectAll("path").data(data_ready);

  u.join("path")
    .transition()
    .duration(1000)
    .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
    .attr("fill", function (d) {
      return color(d.data[0]);
    })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1);
}
update(data1);
