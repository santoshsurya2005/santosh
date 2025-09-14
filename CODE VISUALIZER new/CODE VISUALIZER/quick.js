document.addEventListener('DOMContentLoaded', () => {
    let array = [];
    let phases = [];
    let interval;
    let isPaused = false;
    let speed = 1000;
    let pauseTime = 1000;

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
    startSortButton.addEventListener('click', startQuickSort);
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
    }

    function renderBars(arr, highlight = [], colorMap = {}) {
        barsContainer.innerHTML = '';
        arr.forEach((value, index) => {
            const bubble = document.createElement('div');
            bubble.classList.add('step');
            bubble.textContent = value;

            if (colorMap[index]) {
                bubble.classList.add(colorMap[index]);
            }

            barsContainer.appendChild(bubble);
        });
    }

    function updateSpeed() {
        speed = parseInt(speedControl.value);
        const speedValue = document.getElementById('speedValue');
        if (speedValue) speedValue.innerText = `${speed} ms`;
    }

    function updatePauseTime() {
        pauseTime = parseInt(pauseTimeInput.value);
        if (pauseTime < 500) pauseTime = 500;
        if (pauseTime > 10000) pauseTime = 10000;
    }

    function togglePause() {
        isPaused = !isPaused;
        pauseResumeButton.innerText = isPaused ? 'Resume' : 'Pause';
        if (!isPaused) showPhases();
    }

    function startQuickSort() {
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

        quickSort(array, 0, array.length - 1);

        // Push final sorted phase
        phases.push({
            array: [...array],
            highlight: [], // We'll handle highlighting ALL indices below
            type: 'sorted',
            action: `Final Sorted Array: [${array.join(', ')}]`
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
        let i = low - 1;

        phases.push({
            array: [...arr],
            highlight: [high],
            type: 'pivot',
            action: `Choosing pivot ${pivot} at index ${high}`
        });

        for (let j = low; j < high; j++) {
            phases.push({
                array: [...arr],
                highlight: [j, high],
                type: 'comparing',
                action: `Comparing ${arr[j]} with pivot ${pivot}`
            });

            if (arr[j] <= pivot) {
                i++;
                if (i !== j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    phases.push({
                        array: [...arr],
                        highlight: [i, j],
                        type: 'swapping',
                        action: `Swapped ${arr[i]} and ${arr[j]}`
                    });
                }
            }
        }

        if (i + 1 !== high) {
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            phases.push({
                array: [...arr],
                highlight: [i + 1, high],
                type: 'swapping',
                action: `Placed pivot ${arr[i + 1]} at index ${i + 1}`
            });
        }

        return i + 1;
    }

    function showPhases() {
        let phaseIndex = 0;
        clearInterval(interval);

        interval = setInterval(() => {
            if (isPaused) {
                clearInterval(interval);
                return;
            }

            if (phaseIndex < phases.length) {
                const phase = phases[phaseIndex];
                
                // Update highlight array if final sorted phase
                let highlight = phase.highlight;
                if (phase.type === 'sorted') {
                    highlight = Array.from({ length: phase.array.length }, (_, i) => i);
                }

                const colorMap = {};
                highlight.forEach(i => {
                    if (phase.type === 'comparing') {
                        colorMap[i] = 'comparing';
                    } else if (phase.type === 'swapping') {
                        colorMap[i] = 'swapping';
                    } else if (phase.type === 'pivot') {
                        colorMap[i] = 'pivot';
                    } else if (phase.type === 'sorted') {
                        colorMap[i] = 'sorted';
                    }
                });

                renderBars(phase.array, highlight, colorMap);

                const bubbles = document.querySelectorAll('.step');
                highlight.forEach(i => {
                    if (bubbles[i]) {
                        bubbles[i].classList.add('jump');
                        setTimeout(() => bubbles[i].classList.remove('jump'), 400);
                    }
                });

                phasesBoard.innerHTML += `<p>Phase ${phaseIndex + 1}: ${phase.action}</p>`;
                phaseIndex++;
            } else {
                clearInterval(interval);
                alert('Quick Sort Complete!');
            }
        }, speed + pauseTime);
    }
});
