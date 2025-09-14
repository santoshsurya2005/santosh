document.addEventListener('DOMContentLoaded', () => {
    let array = [];
    let phases = [];
    let interval;
    let pauseTime = 1000;
    let isPaused = false;
    let currentPhaseIndex = 0;
    let speed = 500;

    const barsContainer = document.getElementById('bars-container');
    const phasesBoard = document.getElementById('phasesBoard');
    const arrayLengthInput = document.getElementById('arrayLength');
    const arrayValuesInput = document.getElementById('arrayValues');
    const searchValueInput = document.getElementById('searchValue');
    const generateArrayButton = document.getElementById('generateArray');
    const startSearchButton = document.getElementById('startSearch');
    const pauseResumeButton = document.getElementById('pauseResume');
    const speedControl = document.getElementById('speedControl');
    const pauseTimeInput = document.getElementById('pauseTime');

    generateArrayButton.addEventListener('click', generateArray);
    startSearchButton.addEventListener('click', startBinarySearch);
    pauseResumeButton.addEventListener('click', togglePauseResume);
    speedControl.addEventListener('input', updateSpeed);
    pauseTimeInput.addEventListener('input', updatePauseTime);

    function generateArray() {
        const length = parseInt(arrayLengthInput.value);
        const inputValues = arrayValuesInput.value
            .split(',')
            .map(num => parseInt(num.trim()))
            .filter(num => !isNaN(num));

        if (inputValues.length === length) {
            array = inputValues.sort((a, b) => a - b);
        } else {
            array = [];
            for (let i = 0; i < length; i++) {
                array.push(Math.floor(Math.random() * 100) + 1);
            }
            array.sort((a, b) => a - b);
            arrayValuesInput.value = array.join(',');
        }

        renderBubbles(array);
        phases = [];
        phasesBoard.innerHTML = '';
        currentPhaseIndex = 0;
        clearInterval(interval);
        isPaused = false;
        pauseResumeButton.textContent = 'Pause';
    }

    function renderBubbles(arr) {
        barsContainer.innerHTML = '';
        arr.forEach(value => {
            const bubble = document.createElement('div');
            bubble.classList.add('step');
            bubble.innerText = value;
            barsContainer.appendChild(bubble);
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

    function startBinarySearch() {
        const target = parseInt(searchValueInput.value);
        if (isNaN(target)) {
            alert('Please enter a valid search value.');
            return;
        }

        phases = [];
        currentPhaseIndex = 0;
        isPaused = false;
        pauseResumeButton.textContent = 'Pause';

        binarySearch(array, target);
        showPhases();
    }

    function binarySearch(arr, target) {
        let low = 0;
        let high = arr.length - 1;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);

            phases.push({
                array: [...arr],
                highlight: { low, mid, high },
                action: `Checking index ${mid}`,
                details: `Low: ${low} (${arr[low]}), Mid: ${mid} (${arr[mid]}), High: ${high} (${arr[high]})`
            });

            if (arr[mid] === target) {
                phases.push({
                    array: [...arr],
                    highlight: { found: mid },
                    action: `Target found!`,
                    details: `Value ${target} found at index ${mid}`
                });
                return;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        phases.push({
            array: [...arr],
            highlight: {},
            action: `Search complete`,
            details: `Target ${target} not found in the array`
        });
    }

    function showPhases() {
        clearInterval(interval);

        function playNextPhase() {
            if (isPaused || currentPhaseIndex >= phases.length) return;

            const phase = phases[currentPhaseIndex];
            renderBubbles(phase.array);

            const bubbles = document.querySelectorAll('.step');
            bubbles.forEach(b => b.className = 'step');

            if (phase.highlight.found !== undefined) {
                bubbles[phase.highlight.found]?.classList.add('found');
            } else {
                if (phase.highlight.low !== undefined) bubbles[phase.highlight.low]?.classList.add('low');
                if (phase.highlight.mid !== undefined) bubbles[phase.highlight.mid]?.classList.add('mid');
                if (phase.highlight.high !== undefined) bubbles[phase.highlight.high]?.classList.add('low');
            }

            const log = document.createElement('p');
            log.innerHTML = `<strong>${phase.action}</strong><br>${phase.details}`;
            phasesBoard.appendChild(log);
            phasesBoard.scrollTop = phasesBoard.scrollHeight;

            currentPhaseIndex++;

            if (currentPhaseIndex < phases.length) {
                setTimeout(playNextPhase, speed);
            } else {
                setTimeout(() => alert('Binary Search Complete!'), pauseTime);
            }
        }

        playNextPhase();
    }

    function togglePauseResume() {
        isPaused = !isPaused;
        pauseResumeButton.textContent = isPaused ? 'Resume' : 'Pause';
        if (!isPaused) showPhases();
    }
});
