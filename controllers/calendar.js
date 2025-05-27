// chemin du fichier : /home/younes/Les-trois-C-website/controllers/calendar.js
// Supposer que le HTML du calendrier est toujours présent dans le DOM
let selectedDate = null;
window.selectedDate = null;

function setupCalendarInteractions(calendarMonth = null, calendarYear = null) {
    const availableDates = ['2025-05-20', '2025-05-21', '2025-05-25', '2025-05-28'];
    const calendarEl = document.querySelector('#calendar');
    if (!calendarEl) return;

    const today = new Date();
    if (calendarMonth === null) calendarMonth = today.getMonth();
    if (calendarYear === null) calendarYear = today.getFullYear();

    // Logique de navigation (supposer que les boutons précédent/suivant existent dans le HTML statique)
    const prevBtn = calendarEl.querySelector('.calendar-prev');
    const nextBtn = calendarEl.querySelector('.calendar-next');
    if (prevBtn) {
        prevBtn.onclick = () => {
            let prevMonth = calendarMonth - 1;
            let prevYear = calendarYear;
            if (prevMonth < 0) {
                prevMonth = 11;
                prevYear -= 1;
            }
            setupCalendarInteractions(prevMonth, prevYear);
        };
    }
    if (nextBtn) {
        nextBtn.onclick = () => {
            let nextMonth = calendarMonth + 1;
            let nextYear = calendarYear;
            if (nextMonth > 11) {
                nextMonth = 0;
                nextYear += 1;
            }
            setupCalendarInteractions(nextMonth, nextYear);
        };
    }

    // Mettre à jour le titre du mois/année (supposer que .calendar-title existe)
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const title = calendarEl.querySelector('.calendar-title');
    if (title) {
        title.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;
    }

    // Mettre à jour la grille des jours (supposer que .calendar-grid existe)
    const daysGrid = calendarEl.querySelector('.calendar-grid');
    if (!daysGrid) return;
    daysGrid.innerHTML = '';

    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    let startDay = firstDay;
    for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        daysGrid.appendChild(emptyCell);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        dayEl.textContent = day;
        if (availableDates.includes(dateStr)) {
            dayEl.classList.add('available');
            dayEl.addEventListener('click', () => {
                daysGrid.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
                dayEl.classList.add('selected');
                selectedDate = dateStr;
                window.selectedDate = dateStr; // S'assurer que la variable globale est mise à jour pour le résumé
            });
        } else {
            dayEl.classList.add('unavailable');
        }
        daysGrid.appendChild(dayEl);
    }
}

// Aide pour obtenir les éléments/services/voitures/salle sélectionnés
function getSelectedFormData(form) {
    const items = Array.from(form.querySelectorAll('input[name="items[]"]:checked')).map(i => i.value.split('|')[0]);
    const services = Array.from(form.querySelectorAll('input[name="services[]"]:checked')).map(i => i.value);
    const salle = form.querySelector('input[name="salle"]:checked')?.value || '';
    const car = form.querySelector('input[name="car"]:checked')?.value || '';
    // Toujours utiliser la date sélectionnée globale
    const date = window.selectedDate || null;
    return { items, services, salle, car, date };
}

function renderSummaryBox(form) {
    // Supprimer le résumé précédent s'il existe
    let oldBox = document.getElementById('order-summary-box');
    if (oldBox) oldBox.remove();

    const { items, services, salle, car, date } = getSelectedFormData(form);
    const box = document.createElement('div');
    box.id = 'order-summary-box';
    box.className = 'order-summary-box';
    box.innerHTML = `
        <h3>Résumé de la commande</h3>
        <ul>
            <li><strong>Date sélectionnée:</strong> ${date || 'Aucune'}</li>
            <li><strong>Plats:</strong> ${items.length ? items.join(', ') : 'Aucun'}</li>
            <li><strong>Services:</strong> ${services.length ? services.join(', ') : 'Aucun'}</li>
            <li><strong>Salle:</strong> ${salle || 'Aucune'}</li>
            <li><strong>Voiture:</strong> ${car || 'Aucune'}</li>
        </ul>
        <button type="button" id="confirm-order-btn">Confirmer la commande</button>
    `;
    // Insérer après le bouton Commander
    const commanderBtn = form.querySelector('button[type="submit"]');
    commanderBtn.parentNode.insertBefore(box, commanderBtn.nextSibling);

    // Gestionnaire du bouton de confirmation
    box.querySelector('#confirm-order-btn').onclick = function() {
        form.submit();
    };
}

// Intercepter la soumission du formulaire pour afficher la boîte de résumé
const form = document.getElementById('section-menu');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        renderSummaryBox(form);
    });
}

// Au DOMContentLoaded, simplement initialiser les interactions (le calendrier est toujours présent)
document.addEventListener('DOMContentLoaded', () => {
    setupCalendarInteractions();
});
