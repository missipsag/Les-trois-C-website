document.querySelectorAll("[data-multi-step]").forEach(multiStepForm => {
    const formSteps = [...multiStepForm.querySelectorAll("[data-step]")];
    let currentStep = formSteps.findIndex(step => step.classList.contains("active"));
    if (currentStep < 0) {
        currentStep = 0;
        formSteps[currentStep].classList.add("active");
    }

    let selectedDate = null;

    multiStepForm.addEventListener("click", e => {
        const nextBtn = e.target.closest("[data-next]");
        const prevBtn = e.target.closest("[data-previous]");
        if (!nextBtn && !prevBtn) return;

        let incrementor = nextBtn ? 1 : prevBtn ? -1 : 0;

        // Gestion spéciale pour l'étape du calendrier (étape 4, index 3)
        if (nextBtn && currentStep === 1) {
            if (!selectedDate) {
                alert("Veuillez sélectionner une date avant de confirmer.");
                e.preventDefault();
                return;
            }
            currentStep += 1;
            showCurrentStep();
            return;
        }

        if (nextBtn) {
            // On valide seulement quand on clique sur suivant
            const inputs = [...formSteps[currentStep].querySelectorAll("input")].filter(
                input => !input.disabled && input.offsetParent !== null
            );
            const allValid = inputs.every(input => input.reportValidity());
            if (!allValid) return;

            // Validation pour la carte d'identité (étape 1)
            if (currentStep === 0) {
                const idCardInput = multiStepForm.querySelector("#idCard");
                const tel = multiStepForm.querySelector('[name="phone"]').value.trim();
                if (idCardInput && !/^\d{9}$/.test(idCardInput.value)) {
                    idCardInput.setCustomValidity("Le numéro de carte doit contenir exactement 9 chiffres.");
                    idCardInput.reportValidity();
                    idCardInput.setCustomValidity("");
                    return;
                }
                if (!/^\d{10}$/.test(tel)) {
                    alert("Le numéro de téléphone doit contenir exactement 10 chiffres.");
                    return;
                }
            }
        }

        currentStep += incrementor;
        showCurrentStep();
    });

    function showCurrentStep() {
        formSteps.forEach((step, index) => {
            step.classList.toggle("active", index === currentStep);
        });
        // On génère le calendrier quand on arrive à l'étape 2 de l'index 1
        if (currentStep === 1) {
            generateCalendar(multiStepForm);
        }
    }

    // Aller à une étape précise du formulaire multi-étapes
    function goToStep(stepIndex) {
        if (!Array.isArray(formSteps)) return;
        if (stepIndex < 0 || stepIndex >= formSteps.length) return;
        currentStep = stepIndex;
        showCurrentStep();
    }
    function loadBootstrapStyles() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
        document.head.appendChild(link);
    }
    // Générer un calendrier simple avec les dates dispos 
module.exports.generateCalendar = function (step, calendarMonth = null , calendarYear = null) {
        const availableDates = ['2025-05-20', '2025-05-21', '2025-05-25', '2025-05-28'];
        const calendarEl = step.querySelector('#calendar');
        if (!calendarEl) return;
        calendarEl.innerHTML = '';

        const today = new Date();
        if (calendarMonth=== null) calendarMonth = today.getMonth();
        if (calendarYear === null )  calendarYear = today.getFullYear();

        // pour la navigation
        loadBootstrapStyles();
        const header = document.createElement('div');
        header.className = 'd-flex justify-content-between align-items-center mb-2';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn btn-outline-secondary btn-sm';
        prevBtn.textContent = '<';
        prevBtn.onclick = () => {
            let prevMonth = calendarMonth - 1;
            let prevYear = calendarYear; 
            if (prevMonth < 0) {
                prevMonth = 11;
                prevYear -= 1;
            }
            generateCalendar(step, prevMonth, prevYear);
        };

        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-outline-secondary btn-sm';
        nextBtn.textContent = '>';
        nextBtn.onclick = () => {
            let nextMonth = calendarMonth + 1;
            let nextYear = calendarYear;
            if (nextMonth > 11) {
                nextMonth = 0;
                nextYear += 1;
            }
            generateCalendar(step, nextMonth, nextYear);
        };

        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const title = document.createElement('span');
        title.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;
        title.className = 'fw-bold';

        header.appendChild(prevBtn);
        header.appendChild(title);
        header.appendChild(nextBtn);
        calendarEl.appendChild(header);

        // jours de la sem
        const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        const weekdaysRow = document.createElement('div');
        weekdaysRow.className = 'calendar-weekdays';
        weekdays.forEach(day => {
            const wd = document.createElement('div');
            wd.textContent = day;
            weekdaysRow.appendChild(wd);
        });
        calendarEl.appendChild(weekdaysRow);

        // Days grid
        const daysGrid = document.createElement('div');
        daysGrid.className = 'calendar-grid';

        const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
        const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

        // dimanche debut de semaine
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
                });
            } else {
                dayEl.classList.add('unavailable');
            }

            daysGrid.appendChild(dayEl);
        }

        calendarEl.appendChild(daysGrid);
    }

    // Boutton de confirmation finalee
    const finalConfirmBtn = multiStepForm.closest("dialog")?.querySelector("#final-confirm-btn");
    if (finalConfirmBtn) {
        finalConfirmBtn.addEventListener("click", function () {

            multiStepForm.reset();
            formSteps.forEach((step, idx) => {
                step.classList.toggle("active", idx === 0);
            });
            selectedDate = null;

            const dialog = multiStepForm.closest("dialog");
            if (dialog) {
                const step1 = dialog.querySelector("#reservation-step1");
                const step2 = dialog.querySelector("#reservation-step2");

                if (step1) {
                    step1.reset();
                    step1.style.display = "block";
                }
                if (step2) {
                    step2.reset();
                    step2.style.display = "none";
                }

                multiStepForm.style.display = "none";
                dialog.close();
            }
        });
    }

    // Attacher des fonctions globales pour les événements onclick 
    window.generateCalendar = () => generateCalendar(multiStepForm);
});
  



