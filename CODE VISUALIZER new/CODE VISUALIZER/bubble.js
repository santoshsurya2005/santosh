document.addEventListener('DOMContentLoaded', () => {
    let array = [];
    let phases = [];
    let interval;
    let isPaused = false;
    let speed = 1000;
    let phaseIndex = 0;

    const barsContainer = document.getElementById('bars-container');
    const phasesBoard = document.getElementById('phasesBoard');
    const arrayLengthInput = document.getElementById('arrayLength');
    const arrayValuesInput = document.getElementById('arrayValues');
    const generateArrayButton = document.getElementById('generateArray');
    const startSortButton = document.getElementById('startSort');
    const speedControl = document.getElementById('speedControl');
    const pauseResumeButton = document.getElementById('pauseResume');

    // Event listeners
    generateArrayButton.addEventListener('click', generateArray);
    startSortButton.addEventListener('click', startSort);
    speedControl.addEventListener('input', updateSpeed);
    pauseResumeButton.addEventListener('click', togglePause);

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
        phaseIndex = 0;
    }

    function renderBars(arr, highlights = {}, sortedIndices = []) {
        barsContainer.innerHTML = '';
        arr.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('step');
            if (highlights.pivot === index) bar.classList.add('pivot');
            if (highlights.comparing && highlights.comparing.includes(index)) bar.classList.add('highlight');
            if (sortedIndices.includes(index)) bar.classList.add('sorted');
            bar.innerText = value;
            barsContainer.appendChild(bar);
        });
    }

    function updateSpeed() {
        speed = parseInt(speedControl.value);
        document.getElementById('speedValue').innerText = `${speed} ms`;
    }

    function togglePause() {
        isPaused = !isPaused;
        pauseResumeButton.innerText = isPaused ? 'Resume' : 'Pause';
        if (!isPaused) {
            showPhases();
        } else {
            clearInterval(interval);
        }
    }

    function startSort() {
        if (!array.length) {
            generateArray();
        }
        phases = [];
        phaseIndex = 0;
        const workingArray = [...array];
        quickSort(workingArray, 0, workingArray.length - 1);
        // Final phase: mark all sorted
        phases.push({
            array: [...workingArray],
            highlights: {},
            sorted: Array.from({ length: workingArray.length }, (_, i) => i),
            action: `All elements sorted`
        });
        showPhases();
    }

    function quickSort(arr, low, high) {
        if (low < high) {
            const pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    }

    function partition(arr, low, high) {
        const pivot = arr[high];
        phases.push({
            array: [...arr],
            highlights: { pivot: high },
            action: `Choosing pivot ${pivot} at index ${high}`
        });
        let i = low - 1;
        for (let j = low; j < high; j++) {
            phases.push({
                array: [...arr],
                highlights: { pivot: high, comparing: [j] },
                action: `Comparing ${arr[j]} with pivot ${pivot}`
            });
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                phases.push({
                    array: [...arr],
                    highlights: { pivot: high, comparing: [i, j] },
                    action: `Swapped ${arr[i]} and ${arr[j]}`
                });
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        phases.push({
            array: [...arr],
            highlights: { pivot: i + 1 },
            action: `Moved pivot to position ${i + 1}`
        });
        return i + 1;
    }

    function showPhases() {
        clearInterval(interval);
        interval = setInterval(() => {
            if (isPaused) {
                clearInterval(interval);
                return;
            }

            if (phaseIndex < phases.length) {
                const phase = phases[phaseIndex];
                renderBars(phase.array, phase.highlights, phase.sorted || []);

                const log = document.createElement('p');
                log.textContent = `Phase ${phaseIndex + 1}: ${phase.action}`;
                phasesBoard.appendChild(log);

                phaseIndex++;
            } else {
                clearInterval(interval);
            }
        }, speed);
    }
});
