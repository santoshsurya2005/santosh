// ✅ HEAP SORT VISUALIZER - FIXED AND COMPLETE

document.addEventListener('DOMContentLoaded', () => {
  let array = [];
  let isPaused = false;
  let speed = 1000;
  let sortedIndices = [];

  const barsContainer = document.getElementById('bars-container');
  const phasesBoard = document.getElementById('phasesBoard');
  const arrayLengthInput = document.getElementById('arrayLength');
  const arrayValuesInput = document.getElementById('arrayValues');
  const generateArrayBtn = document.getElementById('generateArray');
  const startSortBtn = document.getElementById('startSort');
  const pauseResumeBtn = document.getElementById('pauseResume');
  const speedControl = document.getElementById('speedControl');
  const speedValue = document.getElementById('speedValue');
  const resetBtn = document.getElementById('resetBtn');

  function generateRandomArray(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 100));
  }

  function createBars() {
    barsContainer.innerHTML = '';
    array.forEach((value) => {
      const bar = document.createElement('div');
      bar.classList.add('step');
      bar.textContent = value;
      barsContainer.appendChild(bar);
    });
  }

  function updateBars(highlightIndices = [], sorted = []) {
    const bars = document.querySelectorAll('.step');
    bars.forEach((bar, index) => {
      bar.textContent = array[index];
      bar.classList.remove('highlight', 'swapping', 'sorted');
      if (highlightIndices.includes(index)) bar.classList.add('highlight');
      if (sorted.includes(index)) bar.classList.add('sorted');
    });
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function waitWhilePaused() {
    return new Promise(resolve => {
      const check = () => {
        if (!isPaused) resolve();
        else setTimeout(check, 100);
      };
      check();
    });
  }

  function addPhase(text) {
    const div = document.createElement('div');
    div.textContent = `• ${text}`;
    phasesBoard.appendChild(div);
  }

  async function heapify(n, i) {
    if (isPaused) await waitWhilePaused();

    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) largest = left;
    if (right < n && array[right] > array[largest]) largest = right;

    updateBars([i, left, right], sortedIndices);
    addPhase(`Compare: ${array[i]} with ${array[left] ?? '-'} and ${array[right] ?? '-'}`);
    await sleep(speed);

    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      addPhase(`Swap: ${array[largest]} <-> ${array[i]}`);
      updateBars([i, largest], sortedIndices);
      await sleep(speed);
      await heapify(n, largest);
    }
  }

  async function heapSort() {
    if (array.length === 0) {
      alert("Please generate or input an array first.");
      return;
    }

    const n = array.length;
    sortedIndices = [];
    addPhase("Start Heap Sort");

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      [array[0], array[i]] = [array[i], array[0]];
      sortedIndices.push(i);
      updateBars([0, i], sortedIndices);
      addPhase(`Move Max: ${array[i]} to end`);
      await sleep(speed);
      await heapify(i, 0);
    }

    sortedIndices.push(0);
    updateBars([], sortedIndices);
    addPhase("Heap Sort Completed");
  }

  generateArrayBtn.addEventListener('click', () => {
    const length = parseInt(arrayLengthInput.value) || 6;
    const input = arrayValuesInput.value.trim();

    array = input
      ? input.split(',').map(Number).filter(n => !isNaN(n))
      : generateRandomArray(length);

    arrayValuesInput.value = array.join(',');
    createBars();
    phasesBoard.innerHTML = '';
    sortedIndices = [];
  });

  startSortBtn.addEventListener('click', async () => {
    isPaused = false;
    speed = Math.max(100, Math.min(parseInt(speedControl.value), 2000));
    await heapSort();
  });

  pauseResumeBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseResumeBtn.textContent = isPaused ? 'Resume' : 'Pause';
  });

  speedControl.addEventListener('input', () => {
    speed = Math.max(100, Math.min(parseInt(speedControl.value), 2000));
    speedValue.textContent = `${speed} ms`;
  });

  resetBtn.addEventListener('click', () => {
    array = [];
    barsContainer.innerHTML = '';
    phasesBoard.innerHTML = '';
    arrayValuesInput.value = '';
    arrayLengthInput.value = '';
    pauseResumeBtn.textContent = 'Pause';
    isPaused = false;
    sortedIndices = [];
  });
});
