// BEGIN
export default () => {
    const calcForm = document.querySelector('form');
    const numberInput = calcForm.querySelector('input[name="number"]');
    const display = document.getElementById('result');
    const resetBtn = calcForm.querySelector('button[type="button"]');

    let totalSum = 0;

    function refreshDisplay() {
        display.textContent = totalSum;
    }

    function resetInput() {
        calcForm.reset();
        numberInput.focus();
    }

    calcForm.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const enteredValue = parseInt(numberInput.value, 10);
        if (!isNaN(enteredValue)) {
            totalSum += enteredValue;
            refreshDisplay();
        }
        resetInput();
    });

    resetBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        totalSum = 0;
        refreshDisplay();
        resetInput();
    });

    numberInput.focus();
};
// END
