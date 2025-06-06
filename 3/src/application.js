// BEGIN
export default function app(laptopList) {
    const filterForm = document.querySelector('form');
    const outputContainer = document.querySelector('.result');

    function renderResults(items) {
        outputContainer.innerHTML = '';
        if (items.length === 0) return;

        const ul = document.createElement('ul');
        items.forEach(({ model }) => {
            const li = document.createElement('li');
            li.textContent = model;
            ul.appendChild(li);
        });
        outputContainer.appendChild(ul);
    }

    function applyFilters() {
        const data = new FormData(filterForm);
        const criteria = {
            cpuType: data.get('processor_eq'),
            ram: data.get('memory_eq'),
            freqMin: parseFloat(data.get('frequency_gte')) || 0,
            freqMax: parseFloat(data.get('frequency_lte')) || Infinity,
        };

        const filteredLaptops = laptopList.filter(({ processor, memory, frequency }) => {
            return (
                (!criteria.cpuType || processor === criteria.cpuType) &&
                (!criteria.ram || memory === parseInt(criteria.ram)) &&
                frequency >= criteria.freqMin &&
                frequency <= criteria.freqMax
            );
        });

        renderResults(filteredLaptops);
    }

    filterForm.addEventListener('input', applyFilters);
    filterForm.addEventListener('change', applyFilters);

    renderResults(laptopList);
}
// END
