function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

buildMetadata(sampleObj = "940");

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);

    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    var sortedIds = otuIds.sort((a, b) => a.otuIds - b.otuIds);
    console.log(otuIds);
    sortedIds = sortedIds.slice(0, 10).map(otuID => `OTU ${otuID}`);
    sortedIds = sortedIds.reverse();
    console.log(sortedIds);

    var sortedValues = sampleValues.sort((a, b) => a.sampleValues - b.sampleValues);

    sortedValues = sortedValues.slice(0, 10);
    sortedValues = sortedValues.reverse();
    console.log(sortedValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var barYTicks = sortedIds;
    var barXData = sortedValues;

  // Horizontal Bar Chart

    // 8. Create the trace for the bar chart. 

    var trace = {
      x: barXData,
      y: barYTicks,
      orientation: 'h',
      type: "bar"
    };

    var bartrace = [trace];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: `Top 10 Bacteria Cultures in Subject ${sample}`,
      xaxis: { title: "Frequency" },
      yaxis: { title: "Bacteria ID" }
    };

    var config = {responsive: true}

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", bartrace, barLayout, config);
  
  // Bubble Chart

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: 'Earth'
        }
      };

    var bubbleTrace = [bubbleData];  

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: `All Bacteria Cultures Per Sample ${sample}`,
      showlegend: false,
      xaxis: { title: "OTU ID"},
      yaxis: { title: "Bacteria Count"},
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout, config); 

  // Gauge Chart

    // Create a variable that holds the samples array. 
    var metadata = data.metadata;

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeResult = metadataArray[0];

    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(gaugeResult.wfreq);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = {
      type: "indicator",
      mode: "gauge+number",
      value: washFreq,
      title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week", font: {size: 24}},
      gauge: {
        'axis': {'range': [null, 10], 'tickwidth': 1, 'tickcolor': "black"},
        'bar': {'color': "black"},
        'bgcolor': "white",
        'borderwidth': 2,
        'bordercolor': "gray",
        'steps': [
            {'range': [0, 2], 'color': 'red'},
            {'range': [2, 4], 'color': 'orange'},
            {'range': [4, 6], 'color': 'yellow'},
            {'range': [6, 8], 'color': 'springgreen'},
            {'range': [8, 10], 'color': 'green'}]
      }
    };

    var gaugeTrace = [gaugeData];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: {t: 25, r: 25, l: 25, b: 25},
      paper_bgcolor: "white",
      font: {color: "black", family: "Arial"}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeTrace, gaugeLayout, config);
  });
}