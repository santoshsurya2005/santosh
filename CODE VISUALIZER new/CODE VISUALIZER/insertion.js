document.addEventListener('DOMContentLoaded', () => {
    let array = [];
    let phases = [];
    let interval;
    let isPaused = false;
    let speed = 1000;
    let pauseTime = 1000;
    let currentPhaseIndex = 0;

    const barsContainer = document.getElementById('bars-container');
    const phasesBoard = document.getElementById('phasesBoard');
    const arrayLengthInput = document.getElementById('arrayLength');
    const arrayValuesInput = document.getElementById('arrayValues');
    const generateArrayButton = document.getElementById('generateArray');
    const startSortButton = document.getElementById('startSort');
    const speedControl = document.getElementById('speedControl');
    const pauseResumeButton = document.getElementById('pauseResume');
    const pauseTimeInput = document.getElementById('pauseTime');

    generateArrayButton.addEventListener('click', generateArray);
    startSortButton.addEventListener('click', startInsertionSort);
    speedControl.addEventListener('input', updateSpeed);
    pauseResumeButton.addEventListener('click', togglePause);
    pauseTimeInput.addEventListener('input', updatePauseTime);

    function generateArray() {
        const length = parseInt(arrayLengthInput.value);
        const inputValues = arrayValuesInput.value
            .split(',')
            .map(num => parseInt(num.trim()))
            .filter(num => !isNaN(num));

        if (inputValues.length === length) {
            array = inputValues;
        } else {
            array = Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
            arrayValuesInput.value = array.join(',');
        }

        renderBars(array);
        phases = [];
        phasesBoard.innerHTML = '';
        currentPhaseIndex = 0;
    }

    function renderBars(arr, highlight = [], sorted = []) {
        barsContainer.innerHTML = '';
        arr.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('step');
            bar.innerText = value;

            if (highlight.includes(index)) {
                bar.classList.add('comparing');
            }
            if (sorted.includes(index)) {
                bar.classList.add('sorted');
            }

            barsContainer.appendChild(bar);
        });
    }

    function updateSpeed() {
        speed = parseInt(speedControl.value);
        document.getElementById('speedValue').innerText = `${speed} ms`;
    }

    function updatePauseTime() {
        pauseTime = parseInt(pauseTimeInput.value);
        if (pauseTime < 500) pauseTime = 500;
        if (pauseTime > 10000) pauseTime = 10000;
    }

    function togglePause() {
        isPaused = !isPaused;
        pauseResumeButton.innerText = isPaused ? 'Resume' : 'Pause';
        if (!isPaused) showPhases(); // Resume if unpaused
    }

    function startInsertionSort() {
        const inputValues = arrayValuesInput.value
            .split(',')
            .map(num => parseInt(num.trim()))
            .filter(num => !isNaN(num));
        const expectedLength = parseInt(arrayLengthInput.value);

        if (inputValues.length === expectedLength) {
            array = inputValues;
        } else {
            array = Array.from({ length: expectedLength }, () => Math.floor(Math.random() * 100) + 1);
            arrayValuesInput.value = array.join(',');
        }

        renderBars(array);
        phases = [];
        phasesBoard.innerHTML = '';
        currentPhaseIndex = 0;

        insertionSort(array);

        // Add the final sorted state
        phases.push({
            array: [...array],
            highlight: [],
            sorted: [], // Will be filled in showPhases()
            action: `Final Sorted Array: [${array.join(', ')}]`
        });

        showPhases();
    }

    function insertionSort(arr) {
        const n = arr.length;

        for (let i = 1; i < n; i++) {
            const key = arr[i];
            let j = i - 1;

            phases.push({
                array: [...arr],
                highlight: [i],
                sorted: [],
                action: `Selected element ${key} at index ${i}`
            });

            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];

                phases.push({
                    array: [...arr],
                    highlight: [j, j + 1],
                    sorted: [],
                    action: `Shifting ${arr[j]} to the right`
                });

                j--;
            }

            arr[j + 1] = key;

            phases.push({
                array: [...arr],
                highlight: [j + 1],
                sorted: [],
                action: `Placed ${key} at index ${j + 1}`
            });
        }
    }

    function showPhases() {
        clearInterval(interval);

        interval = setInterval(() => {
            if (isPaused) {
                clearInterval(interval);
                return;
            }

            if (currentPhaseIndex < phases.length) {
                const phase = phases[currentPhaseIndex];

                // If final phase, mark all as sorted
                let sortedIndices = phase.sorted;
                if (currentPhaseIndex === phases.length - 1) {
                    sortedIndices = Array.from({ length: phase.array.length }, (_, i) => i);
                }

                renderBars(phase.array, phase.highlight, sortedIndices);

                const log = document.createElement('p');
                log.textContent = `Phase ${currentPhaseIndex + 1}: ${phase.action}`;
                phasesBoard.appendChild(log);

                currentPhaseIndex++;
            } else {
                clearInterval(interval);
                alert('Insertion Sort Complete!');
            }
        }, speed + pauseTime);
    }
});
