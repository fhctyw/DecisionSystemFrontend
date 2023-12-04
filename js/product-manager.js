(function() {
    function fetchCurrentAnalysis() {
        // Fetch current analysis data from the server
        // Assuming you have an endpoint like /api/current-analysis
        fetch('http://localhost:5000/api/manager/product-analys')
            .then(response => response.json())
            .then(data => displayCurrentAnalysis(data))
            .catch(error => console.error('Error fetching current analysis:', error));
    }
    
    function displayCurrentAnalysis(data) {
        const tableBody = document.getElementById('currentAnalysisTable').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear existing data
    
        // Populate the table with new data
        data.forEach((item, index) => {
            let row = tableBody.insertRow();
            let cellIndex = row.insertCell(0);
            let cellProductId = row.insertCell(1);
            let cellPopularity = row.insertCell(2);
    
            cellIndex.textContent = index + 1; // Add index numbers starting at 1
            cellProductId.textContent = item.productId;
            cellPopularity.textContent = item.popularity ? item.popularity.toFixed(2) : 'N/A';
        });
    }
    
    // Fetch and display historical analysis
    function fetchHistoricalAnalysis() {
        // Fetch historical analysis data from the server
        // Assuming you have an endpoint like /api/historical-analysis
        fetch('http://localhost:5000/api/manager/reports')
            .then(response => response.json())
            .then(data => displayHistoricalAnalysis(data))
            .catch(error => console.error('Error fetching historical analysis:', error));
    }
    
    function displayHistoricalAnalysis(data) {
        const historicalAnalysisContent = document.getElementById('historicalAnalysisContent');
        historicalAnalysisContent.innerHTML = ''; // Clear existing data
    
        data.forEach((report, index) => {
            let section = document.createElement('section');
            section.className = 'mb-4'; // Adds bottom margin to each section for spacing
    
            let headerContainer = document.createElement('div');
            headerContainer.className = 'd-flex justify-content-between align-items-center mb-2'; // Use flexbox for layout and add bottom margin
    
            let heading = document.createElement('h3');
            heading.textContent = `Report Date: ${new Date(report.date).toLocaleDateString()}`;
            headerContainer.appendChild(heading);
    
            let applyButton = document.createElement('button');
            applyButton.textContent = 'Apply Analysis';
            applyButton.className = 'btn btn-primary btn-sm'; // Bootstrap button styling
            applyButton.id = `applyButton-${index}`; // Unique ID for each button
            applyButton.onclick = function() {
                // Reset other buttons
                resetApplyButtons(index);
                // Set this button as applied
                this.disabled = true; 
                this.textContent = 'Applied';
                applyHistoricalAnalysis(report.analyses, index);
            };
            headerContainer.appendChild(applyButton);

            section.appendChild(headerContainer);
    
            let table = document.createElement('table');
            table.className = 'table'; // Bootstrap table styling
            let thead = document.createElement('thead');
            let tbody = document.createElement('tbody');
            let headerRow = thead.insertRow();
    
            ['Product ID', 'Popularity'].forEach(headerText => {
                let th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
    
            report.analyses.forEach(analysis => {
                let tr = tbody.insertRow();
                let tdProduct = tr.insertCell();
                tdProduct.textContent = analysis.productId;
                let tdPopularity = tr.insertCell();
                tdPopularity.textContent = analysis.popularity.toFixed(2);
            });
    
            table.appendChild(thead);
            table.appendChild(tbody);
            section.appendChild(table);
    
            historicalAnalysisContent.appendChild(section);
        });
    }
    
    function resetApplyButtons(exceptIndex) {
        document.querySelectorAll('[id^=applyButton-]').forEach((button, idx) => {
            if (idx !== exceptIndex) {
                button.disabled = false;
                button.textContent = 'Apply Analysis';
            }
        });
    }
    
    function applyHistoricalAnalysis(analyses) {
        // Logic to replace the current analysis with the historical one
        // This might involve updating the state of your application and re-rendering the component that displays the current analysis.
        console.log('Applying historical analysis:', analyses);
        // Here you would likely make a POST or PUT request to your server to update the current analysis.
        // After the update, you may need to fetch the current analysis again to refresh the view.
    }
    
    // Initial data fetches
    fetchCurrentAnalysis();
    fetchHistoricalAnalysis();    
})();