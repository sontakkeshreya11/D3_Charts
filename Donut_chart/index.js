d3.csv("GlobalData.csv", (d) => {
  return {
    industry: d.Industry,
    percentage: Number(d.Percentage),
  };
}).then((data) => {
  console.log(data);
  const SVG_HEIGHT = d3.select("#Donut_chart svg").node().clientWidth;
  const SVG_WIDTH = d3.select("#Donut_chart svg").node().clientHeight;
  console.log(SVG_WIDTH);
  console.log(SVG_HEIGHT);
  const cumsum = d3.cumsum(data, (d) => d.percentage);
  const sum = d3.sum(data, (d) => d.percentage);
  data.forEach((obj, index) => {
    obj.startAngle = index == 0 ? 0 : (cumsum[index - 1] / sum) * Math.PI * 2;
    obj.endAngle = (cumsum[index] / sum) * Math.PI * 2;
    obj.innerRadius = (SVG_WIDTH / 2) * 0.1;
    obj.outerRadius = (SVG_WIDTH / 2) * 0.9;
    obj.id = index;
  });
  console.log(data);

  const Donut_G = d3
    .select("#Donut_chart svg")
    .append("g")
    .attr("id", "donutG")
    .attr("transform", `translate(${SVG_WIDTH / 2},${SVG_WIDTH / 2})`);
  Donut_G.selectAll("path")
    .data(data)
    .join("path")
    .transition()
    .duration(3000)
    .attr(
      "d",
      d3
        .arc()
        .innerRadius((d) => d.innerRadius)
        .outerRadius((d) => d.outerRadius)
        .startAngle((d) => d.startAngle)
        .endAngle((d) => d.endAngle)
        .padAngle(0.02)
        .cornerRadius(5)
    )
    .style("fill", (d, i) => d3.schemeTableau10[i])
    .delay((d, i) => {
      return i * 200;
    });

  data.forEach((obj, index) => {
    let [x, y] = d3.arc().centroid({
      innerRadius: obj.outerRadius + 15,
      outerRadius: obj.outerRadius + 15,
      startAngle: obj.startAngle,
      endAngle: obj.endAngle,
    });
    console.log(x, y);
    Donut_G.append("text")
      .text(obj.percentage)
      .transition()
      .duration(4000)
      .attr("x", x)
      .attr("y", y)
      .style("text-anchor", "middle")
      .style("font-weight", "600")
      .style("font-size", "10")
      .style("fill", d3.schemeTableau10[index])
      .delay((d, i) => {
        return i * 300;
      });
  });

  Donut_G.selectAll("path").style("cursor", "pointer");

  Donut_G.selectAll("path").on("mouseover", (e, d) => {
    document.querySelector(
      "#output h2"
    ).innerText = `${d.industry}-${d.percentage}%`;
    document.querySelector("#output h2").style.color = `${
      d3.schemeTableau10[d.id]
    }`;
  });
});
