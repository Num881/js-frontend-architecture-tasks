// BEGIN
// BEGIN
export default function createCompanyButtons(companies) {
    const mainContainer = document.querySelector('.container');
    const buttonsWrapper = document.createElement('div');
    mainContainer.appendChild(buttonsWrapper);

    let activeDescriptionElem = null;
    let activeCompany = null;

    companies.forEach(({ name, description }) => {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-primary', 'm-1');
        btn.textContent = name;

        btn.addEventListener('click', () => {
            if (activeCompany === name) {
                // Если кликнули по уже активной компании — скрываем описание
                if (activeDescriptionElem) {
                    activeDescriptionElem.remove();
                    activeDescriptionElem = null;
                }
                activeCompany = null;
            } else {
                // Если есть активное описание — удаляем его
                if (activeDescriptionElem) {
                    activeDescriptionElem.remove();
                }
                // Создаём и показываем описание новой компании
                if (description) {
                    activeDescriptionElem = document.createElement('div');
                    activeDescriptionElem.textContent = description;
                    mainContainer.appendChild(activeDescriptionElem);
                } else {
                    activeDescriptionElem = null;
                }
                activeCompany = name;
            }
        });

        buttonsWrapper.appendChild(btn);
    });
}
// END

// END