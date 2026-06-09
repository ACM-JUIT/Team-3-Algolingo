document.addEventListener('DOMContentLoaded', () => {

    const towerCards = document.querySelectorAll('.tower-card');

    towerCards.forEach(card => {

        card.addEventListener('click', () => {

            const tower = card.querySelector('h3').textContent;

            alert(`${tower} coming soon!`);

        });

    });

});