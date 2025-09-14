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
    startSortButton.addEventListener('click', startMergeSort);
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

    function renderBars(arr, highlight = [], sorted = []) {
        barsContainer.innerHTML = '';
        arr.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('step');
            bar.innerText = value;

            if (highlight.includes(index)) {
                bar.classList.add('highlight');
            }
            if (sorted.includes(index)) {
                bar.classList.add('sorted');
            }
            barsContainer.appendChild(bar);
        });
    }

    function updateSpeed() {
        speed = parseInt(speedControl.value);
        const speedValue = document.getElementById('speedValue');
        if (speedValue) {
            speedValue.innerText = `${speed} ms`;
        }
    }

    function updatePauseTime() {
        pauseTime = parseInt(pauseTimeInput.value);
        if (pauseTime < 500) pauseTime = 500;
        if (pauseTime > 10000) pauseTime = 10000;
    }

    function togglePause() {
        isPaused = !isPaused;
        pauseResumeButton.innerText = isPaused ? 'Resume' : 'Pause';
        if (!isPaused) {
            showPhases();
        }
    }

    function startMergeSort() {
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

        mergeSort(array, 0, array.length - 1);

        // Final phase: all indices will be marked sorted during rendering
        phases.push({
            array: [...array],
            highlight: [],
            sorted: [],
            action: `Final Sorted Array: [${array.join(', ')}]`
        });

        showPhases();
    }

    function mergeSort(arr, left, right) {
        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }

    function merge(arr, left, mid, right) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            phases.push({
                array: [...arr],
                highlight: [k],
                sorted: [],
                action: `Comparing ${leftArr[i]} and ${rightArr[j]}`
            });

            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }

            phases.push({
                array: [...arr],
                highlight: [],
                sorted: [k],
                action: `Placed ${arr[k]} at position ${k}`
            });

            k++;
        }

        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            phases.push({
                array: [...arr],
                highlight: [],
                sorted: [k],
                action: `Placed ${leftArr[i]} at position ${k}`
            });
            i++;
            k++;
        }

        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            phases.push({
                array: [...arr],
                highlight: [],
                sorted: [k],
                action: `Placed ${rightArr[j]} at position ${k}`
            });
            j++;
            k++;
        }
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
                
                let sorted = phase.sorted;
                // If final phase, mark all indices as sorted
                if (phaseIndex === phases.length - 1) {
                    sorted = Array.from({ length: phase.array.length }, (_, i) => i);
                }

                renderBars(phase.array, phase.highlight, sorted);

                phasesBoard.innerHTML += `<p>Phase ${phaseIndex + 1}: ${phase.action}</p>`;
                phaseIndex++;
            } else {
                clearInterval(interval);
                alert('Merge Sort Complete!');
            }
        }, speed + pauseTime);
    }
});
