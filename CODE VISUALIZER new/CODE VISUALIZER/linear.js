document.addEventListener('DOMContentLoaded', () => {
    let array = [];
    let phases = [];
    let interval;
    let isPaused = false;
    let currentPhaseIndex = 0;
    let speed = 500;
    let pauseTime = 1000;
    let foundIndex = -1;

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
    startSearchButton.addEventListener('click', startLinearSearch);
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
            array = inputValues;
        } else {
            array = [];
            for (let i = 0; i < length; i++) {
                array.push(Math.floor(Math.random() * 100) + 1);
            }
            arrayValuesInput.value = array.join(',');
        }

        foundIndex = -1;
        renderBars(array);
        phases = [];
        phasesBoard.innerHTML = '';
        currentPhaseIndex = 0;
        clearInterval(interval);
        isPaused = false;
        pauseResumeButton.textContent = 'Pause';
    }

    function renderBars(arr) {
        barsContainer.innerHTML = '';
        arr.forEach((value, index) => {
            const box = document.createElement('div');
            box.classList.add('step');
            if (index === foundIndex) box.classList.add('found');
            box.style.height = '50px'; // consistent height
            box.style.width = '50px'; // consistent width
            box.textContent = value;
            barsContainer.appendChild(box);
        });
    }

    function updateSpeed() {
        speed = parseInt(speedControl.value);
        document.getElementById('speedValue').textContent = `${speed} ms`;
    }

    function updatePauseTime() {
        pauseTime = parseInt(pauseTimeInput.value);
        if (pauseTime < 500) pauseTime = 500;
        if (pauseTime > 10000) pauseTime = 10000;
    }

    function startLinearSearch() {
        const target = parseInt(searchValueInput.value);
        if (isNaN(target)) {
            alert('Please enter a valid search value.');
            return;
        }

        phases = [];
        currentPhaseIndex = 0;
        isPaused = false;
        foundIndex = -1;
        pauseResumeButton.textContent = 'Pause';

        linearSearch(array, target);
        showPhases();
    }

    function linearSearch(arr, target) {
        for (let i = 0; i < arr.length; i++) {
            phases.push({
                array: [...arr],
                highlight: [i],
                action: `Checking index ${i}`,
                details: `Comparing ${arr[i]} with target ${target}`,
                found: false
            });

            if (arr[i] === target) {
                foundIndex = i;
                phases.push({
                    array: [...arr],
                    highlight: [i],
                    action: `Target found!`,
                    details: `Value ${target} found at index ${i}`,
                    found: true
                });
                return;
            }
        }

        phases.push({
            array: [...arr],
            highlight: [],
            action: `Search complete`,
            details: `Target ${target} not found in the array`,
            found: false
        });
    }

    function showPhases() {
        clearInterval(interval);

        function playNextPhase() {
            if (isPaused || currentPhaseIndex >= phases.length) return;

            const phase = phases[currentPhaseIndex];
            renderBars(phase.array);

            const bars = document.querySelectorAll('.step');
            bars.forEach(bar => bar.classList.remove('highlight', 'found'));

            if (phase.highlight[0] !== undefined) {
                bars[phase.highlight[0]].classList.add('highlight');
                if (phase.found) {
                    bars[phase.highlight[0]].classList.add('found');
                }
            }

            const log = document.createElement('p');
            log.innerHTML = `<strong>${phase.action}</strong><br>${phase.details}`;
            phasesBoard.appendChild(log);
            phasesBoard.scrollTop = phasesBoard.scrollHeight;

            currentPhaseIndex++;

            if (currentPhaseIndex < phases.length) {
                setTimeout(playNextPhase, speed);
            } else {
                setTimeout(() => alert('Linear Search Complete!'), pauseTime);
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
