async function drawTable() {
  // load raw data
  const datasetRaw = await d3.csv("AccessAtAGlance.csv");

  // map over raw data to return cleaned up data. Use a + as shorthand for 'parseInt()' to convert strings to numbers
  // chain a .sort method to the end to sort by largest % of crisis centers
  const cleanData = datasetRaw
    .map(item => {
      const crisis = +item["Crisis Pregnancy Centres"];
      const medical = +item["Medical Abortion Providers"];
      //console.log(cleanData);
      return {
        province: item["Province or Territory"],
        crisis: crisis,
        medical: medical,
        crisisPercent: crisis / (crisis + medical),
        medicalPercent: medical / (crisis + medical)
      };
    })
    .sort((a, b) => b.crisisPercent - a.crisisPercent);

  console.log(cleanData);
  //Chart Dimensions
  let dimensions = {
    width: 200,
    height: 200
  };

  cleanData.forEach(chart => {
    const svg = d3
      .select(".grid")
      .append("svg")
      .attr("viewBox", [0, 0, dimensions.width, dimensions.height])
      .attr("class", chart.province);

    svg
      .selectAll(".crisis")
      .data([chart])
      .enter()
      .append("rect")
      .attr("width", dimensions.width)
      .attr("y", 0)
      .attr("height", d => d.crisisPercent * dimensions.height)
      .attr("class", "crisis");

    svg
      .selectAll(".medical")
      .data([chart])
      .enter()
      .append("rect")
      .attr("width", dimensions.width)
      .attr("y", d => d.crisisPercent * dimensions.height)
      .attr("height", d => d.medicalPercent * dimensions.height)
      .attr("class", "medical");

    svg
      .selectAll(".line")
      .data([chart])
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("y1", d => d.crisisPercent * dimensions.height)
      .attr("x2", dimensions.width)
      .attr("y2", d => d.crisisPercent * dimensions.height)
      .attr("class", "line");

    svg
      .selectAll("text")
      .data([chart])
      .enter()
      .append("text")
      .text(d => d.province)
      .attr("x", dimensions.width / 2)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .attr("class", "label");

    svg
      .selectAll(".labelCrisis")
      .data([chart])
      .enter()
      .append("text")
      .text(d => d.crisis)
      .attr("x", dimensions.width - 5)
      .attr("y", d => d.crisisPercent * dimensions.height - 3)
      .attr("text-anchor", "end")
      .attr("class", "labelCrisis");

    svg
      .selectAll(".labelMedical")
      .data([chart])
      .enter()
      .append("text")
      .text(d => d.medical)
      .attr("x", dimensions.width - 5)
      .attr("y", d => dimensions.height - 5)
      .attr("text-anchor", "end")
      .attr("class", "labelMedical");
  });
}

drawTable();
