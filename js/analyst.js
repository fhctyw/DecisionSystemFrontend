(function() {
    const analysFactorsContainer = document.getElementById('analysFactors');
    _factors = []
    let totalWeight = 1;

    // Function to fetch and display factors
    function fetchAnalysFactors() {
        fetch('http://localhost:5000/api/analys-factor')
            .then(response => response.json())
            .then(factors => {
                _factors = factors; // Save the original factors
                analysFactorsContainer.innerHTML = ''; // Clear previous sliders
                factors.forEach(factor => createSlider(factor));
            })
            .catch(error => console.error('Error fetching analysis factors:', error));
    }

    // Create a slider for a factor
    function createSlider(factor) {
        if (factor.isImplemented) {
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-container';

            const label = document.createElement('label');
            label.textContent = factor.name;
            label.className = 'slider-label';

            const sliderInputContainer = document.createElement('div');
            sliderInputContainer.className = 'slider-input-container';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '1';
            slider.step = '0.01';
            slider.value = factor.weight;
            slider.dataset.id = factor.id;
            slider.className = 'factor-slider';

            const numberInput = document.createElement('input');
            numberInput.type = 'number';
            numberInput.value = factor.weight;
            numberInput.min = '0';
            numberInput.max = '1';
            numberInput.step = '0.01';
            numberInput.dataset.id = factor.id;
            numberInput.className = 'factor-number-input';        

            // Event listener for when the slider value changes
            slider.addEventListener('input', function(event) {
                handleSliderChange(factor.id.toString(), event.target.value);
            });

            // Event listener for when the number input value changes
            numberInput.addEventListener('input', function(event) {
                handleSliderChange(factor.id.toString(), event.target.value);
            });

            sliderInputContainer.appendChild(slider);
            sliderInputContainer.appendChild(numberInput);
            sliderContainer.appendChild(label);
            sliderContainer.appendChild(sliderInputContainer);
            analysFactorsContainer.appendChild(sliderContainer);
        }
    }
    
    // Handle slider value changes
    function handleSliderChange(changedSliderId, changedSliderValue) {
        const changedSliderValueNum = parseFloat(changedSliderValue);

        // Update the number input display for the changed slider
        const numberInput = document.querySelector(`.factor-number-input[data-id="${changedSliderId}"]`);
        if (numberInput) {
            numberInput.value = changedSliderValueNum.toFixed(2);
        }

        // Calculate the new total weight and adjust other sliders if necessary
        let newTotalWeight = calculateTotalWeight();
        if (newTotalWeight !== 1) {
            adjustOtherSliders(changedSliderId, changedSliderValueNum, newTotalWeight);
        }
    }

    // Adjust the other sliders when one slider's value changes
    function adjustOtherSliders(changedSliderId, changedSliderValue, newTotalWeight) {
        const sliders = document.querySelectorAll('.factor-slider');
        const totalAdjustableWeight = newTotalWeight - changedSliderValue;
        const weightToDistribute = 1 - newTotalWeight;

        sliders.forEach(slider => {
            if (slider.dataset.id !== changedSliderId) {
                const currentWeight = parseFloat(slider.value);
                const adjustmentFactor = currentWeight / totalAdjustableWeight;
                slider.value = (currentWeight + weightToDistribute * adjustmentFactor).toFixed(2);
                
                // Also update the corresponding number input
                const sliderNumberInput = document.querySelector(`.factor-number-input[data-id="${slider.dataset.id}"]`);
                if (sliderNumberInput) {
                    sliderNumberInput.value = slider.value;
                }
            }
        });
    }


    // Calculate the total weight of all factors
    function calculateTotalWeight() {
        const sliders = document.querySelectorAll('.factor-slider');
        let totalWeight = 0;
        sliders.forEach(slider => {
            totalWeight += parseFloat(slider.value);
        });
        return totalWeight;
    }

    document.getElementById('saveButton').addEventListener('click', () => {
        // Map through each slider and update the corresponding factor on the server
        const sliders = Array.from(document.querySelectorAll('.factor-slider'));
    
        // Use Promise.all to wait for all fetch requests to complete
        Promise.all(sliders.map(slider => {
            const factorId = parseInt(slider.dataset.id);
            const factorWeight = parseFloat(slider.value);
            const factor = { id: factorId, weight: factorWeight };
    
            return fetch(`http://localhost:5000/api/analys-factor/weight`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(factor)
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        console.error(`Factor with id ${factorId} not found.`);
                    } else {
                        console.error('Error saving factor:', response);
                    }
                }
                return response.text(); // or .json() if your API returns a JSON response
            });
        }))
        .then(() => {
            console.log('All factors saved successfully');
            fetchAnalysFactors(); // Refresh the factors
        })
        .catch(error => {
            console.error('Error in saving one or more factors:', error);
        });
    });
    

    // Reset the sliders to their original values
    document.getElementById('cancelButton').addEventListener('click', () => {
        _factors.forEach(factor => {
            const slider = document.querySelector(`.factor-slider[data-id="${factor.id}"]`);
            if (slider) {
                slider.value = factor.weight;
            }
        });
    });


    fetchAnalysFactors();
})();