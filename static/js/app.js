// Reading the data from the JSON using D3
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
// Logging the Data
d3.json(url).then(function(data) {
    console.log(data);
  });

// Initialize Dashboard
function init() {
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names for selection
    d3.json(url).then((data) => {

        // Get names
        let names = data.names;
        // Add samples to the menu
        names.forEach((id) => {

            dropdownMenu.append("Option").text(id).property("value",id);
        });

        // Initialize first sample
        let firstSample = names[0];

        // Building initial plots
        buildBar(firstSample);
        buildBubble(firstSample);
        buildMetaData(firstSample);
    });
};

// Funtion to build first Bar Chart
function buildBar(sample) {

    //Retreieve all using D3
    d3.json(url).then((data) => {

        //Retrieve all sample data
        let allSample = data.samples;

        // Filter out the sample values
        let value = allSample.filter(result => result.id == sample);

        // First index
        let valueData = value[0];

        // Assigning the out_ids, otu_labels, and sample_values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Checking data in the console
        console.log(otu_ids, otu_labels, sample_values);

        // Slicing to top 10 in descending
        x_Values = sample_values.slice(0,10).reverse();
        y_Values = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        hover_text = otu_labels.slice(0,10).reverse();

        // Trace for the plot
        let trace1 = {
            x: x_Values,
            y: y_Values,
            text: hover_text,
            type: "bar",
            orientation: "h"
        };
        //Data Array
        let data1 = [trace1];

        // Layout
        let layout = {
            title: "Top 10 OTUs in a Sample"
        };

        // Create the plot
        Plotly.newPlot("bar",data1,layout)
    });
};

// Function to build the Bubble Chart
function buildBubble(sample) {

    //Retreieve all using D3
    d3.json(url).then((data) => {

        //Retrieve all sample data
        let allSample = data.samples;

        // Filter out the sample values
        let value = allSample.filter(result => result.id == sample);

        // First index
        let valueData = value[0];

        // Assigning the out_ids, otu_labels, and sample_values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Checking data in the console
        console.log(otu_ids, otu_labels, sample_values);

        // Trace for the plot
        let trace2 = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Viridis"
            },
            text: otu_labels
        };

        // Data Array
        let data2 = [trace2];

        // Set up a layout
        let layout = {
            title: "Bacteria by Sample",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Size by Sample"}
        };

        // Plot
        Plotly.newPlot("bubble",data2,layout)
    });
};

// Function for the metadata
function buildMetaData(sample) {

    //Retreieve all using D3
    d3.json(url).then((data) => {

        //Retrieve all sample data
        let allMeta = data.metadata;

        // Filter out the values
        let value = allMeta.filter(result => result.id == sample);

        console.log(value);

        // First index
        let valueData = value[0];

        // Creates the table
        d3.select("#sample-metadata").html("");

        // Key-Value Pair
        for (key in valueData) {
            d3.select("#sample-metadata").append("p").text(`${key}: ${valueData[key]}`);
        };

    });  
};

// When dropdown changes
function optionChanged(newSample) {
    buildBar(newSample);
    buildBubble(newSample);
    buildMetaData(newSample);
};

// Call initialization
init();