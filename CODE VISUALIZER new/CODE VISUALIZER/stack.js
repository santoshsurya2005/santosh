document.addEventListener('DOMContentLoaded', () => {
    class Stack {
        constructor(maxSize = 10) {
            this.stack = [];
            this.maxSize = maxSize;
        }

        setMaxSize(size) {
            this.maxSize = size;
            this.stack = []; // Reset stack
            this.updateStep(`Stack size set to ${size}.`);
            this.visualize();
        }

        push(value) {
            if (this.isFull()) {
                this.updateStep(`Stack Overflow! Cannot push ${value}.`);
                return;
            }
            this.stack.push(value);
            this.updateStep(`Pushed ${value} onto the stack.`);
            this.visualize();
        }

        pop() {
            if (this.isEmpty()) {
                this.updateStep('Stack Underflow! Cannot pop.');
                return;
            }
            const poppedValue = this.stack.pop();
            this.updateStep(`Popped ${poppedValue} from the stack.`);
            this.visualize();
        }

        peek() {
            if (this.isEmpty()) {
                this.updateStep('Stack is Empty. Nothing to peek.');
                return;
            }
            this.updateStep(`Top element is ${this.stack[this.stack.length - 1]}.`);
        }

        isEmpty() {
            const isEmpty = this.stack.length === 0;
            this.updateStep(`Stack is ${isEmpty ? 'Empty' : 'Not Empty'}.`);
            return isEmpty;
        }

        isFull() {
            const isFull = this.stack.length >= this.maxSize;
            this.updateStep(`Stack is ${isFull ? 'Full' : 'Not Full'}.`);
            return isFull;
        }

        visualize() {
            const listContainer = document.getElementById('list-container');
            listContainer.innerHTML = ''; // Clear previous

            const maxHeight = 300; // Same as in CSS
            const spacing = 10; // Gap between elements
            const availableHeight = maxHeight - (this.maxSize - 1) * spacing;
            const elementHeight = Math.max(30, availableHeight / this.maxSize);

            this.stack.forEach((value) => {
                const element = document.createElement('div');
                element.classList.add('stack-element');
                element.innerText = value;

                // Apply dynamic height
                element.style.height = `${elementHeight}px`;
                element.style.lineHeight = `${elementHeight}px`;
                element.style.transition = 'all 0.3s ease';

                listContainer.appendChild(element);

                // Force reflow to re-trigger animation
                void element.offsetWidth;
                element.classList.add('animate');
            });
        }

        updateStep(message) {
            const stepsContainer = document.getElementById('steps-container');
            const stepElement = document.createElement('p');
            stepElement.innerText = message;
            stepsContainer.appendChild(stepElement);
            stepsContainer.scrollTop = stepsContainer.scrollHeight; // Auto-scroll
        }
    }

    let stack = null;

    document.getElementById('setMaxSize').addEventListener('click', () => {
        const maxSizeInput = document.getElementById('maxSize').value;
        const maxSize = parseInt(maxSizeInput);

        if (isNaN(maxSize) || maxSize <= 0) {
            alert('Please enter a valid positive number for the stack size.');
            return;
        }

        stack = new Stack(maxSize);

        // Enable buttons
        ['push', 'pop', 'peek', 'isEmpty', 'isFull'].forEach(id => {
            document.getElementById(id).disabled = false;
        });

        stack.updateStep(`Initialized stack with a maximum size of ${maxSize}.`);
    });

    document.getElementById('push').addEventListener('click', () => {
        if (!stack) {
            alert('Please set the maximum stack size first.');
            return;
        }
        const value = prompt('Enter a value to push:');
        if (value !== null && value.trim() !== '') {
            stack.push(value);
        }
    });

    document.getElementById('pop').addEventListener('click', () => {
        if (!stack) {
            alert('Please set the maximum stack size first.');
            return;
        }
        stack.pop();
    });

    document.getElementById('peek').addEventListener('click', () => {
        if (!stack) {
            alert('Please set the maximum stack size first.');
            return;
        }
        stack.peek();
    });

    document.getElementById('isEmpty').addEventListener('click', () => {
        if (!stack) {
            alert('Please set the maximum stack size first.');
            return;
        }
        stack.isEmpty();
    });

    document.getElementById('isFull').addEventListener('click', () => {
        if (!stack) {
            alert('Please set the maximum stack size first.');
            return;
        }
        stack.isFull();
    });
});
