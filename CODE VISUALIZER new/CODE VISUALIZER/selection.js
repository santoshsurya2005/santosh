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
    startSortButton.addEventListener('click', startSelectionSort);
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

    function renderBars(arr, highlight = []) {
        barsContainer.innerHTML = '';
        arr.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('step');
            bar.innerText = value;

            if (highlight.includes(index)) {
                bar.classList.add('highlight');
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
        if (!isPaused) showPhases();
    }

    function startSelectionSort() {
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

        selectionSort(array);

        phases.push({
            array: [...array],
            highlight: [],
            action: `Final Sorted Array: [${array.join(', ')}]`
        });

        showPhases();
    }

    function selectionSort(arr) {
        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;

            phases.push({
                array: [...arr],
                highlight: [i],
                action: `Starting selection at index ${i}, current minimum: ${arr[minIndex]}`
            });

            for (let j = i + 1; j < n; j++) {
                phases.push({
                    array: [...arr],
                    highlight: [j, minIndex],
                    action: `Comparing ${arr[j]} with current minimum ${arr[minIndex]}`
                });

                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                    phases.push({
                        array: [...arr],
                        highlight: [minIndex],
                        action: `New minimum found: ${arr[minIndex]} at index ${minIndex}`
                    });
                }
            }

            if (minIndex !== i) {
                const temp1 = arr[i];
                const temp2 = arr[minIndex];
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

                phases.push({
                    array: [...arr],
                    highlight: [i, minIndex],
                    action: `Swapped ${temp1} at index ${i} with ${temp2} at index ${minIndex}`
                });
            }
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
                renderBars(phase.array, phase.highlight);

                const log = document.createElement('p');
                log.textContent = `Phase ${currentPhaseIndex + 1}: ${phase.action}`;
                phasesBoard.appendChild(log);

                currentPhaseIndex++;
            } else {
                clearInterval(interval);

                // Animate all bubbles to green after sort complete
                const steps = barsContainer.querySelectorAll('.step');
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.classList.add('sorted');
                        step.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            step.style.transform = 'scale(1)';
                        }, 300);
                    }, index * 150);
                });

                alert('Selection Sort Complete!');
            }
        }, speed + pauseTime);
    }
});
