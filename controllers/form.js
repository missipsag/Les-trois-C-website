const multiStepForm = document.querySelector("[data-multi-step]");
if (multiStepForm) {
  const formSteps = [...multiStepForm.querySelectorAll("[data-step]")];
  let currentStep = formSteps.findIndex(step => step.classList.contains("active"));
  if (currentStep < 0) {
    currentStep = 0;
    formSteps[currentStep].classList.add("active");
  }

  multiStepForm.addEventListener("click", e => {
    const nextBtn = e.target.closest("[data-next]");
    const prevBtn = e.target.closest("[data-previous]");
    if (!nextBtn && !prevBtn) return;

    let incrementor = nextBtn ? 1 : prevBtn ? -1 : 0;

    // Gestion spéciale pour l'étape du calendrier (étape 4, index 3)
    if (nextBtn && currentStep === 3) {
      // Géré dans l'autre event listener, donc on saute ici
      return;
    }

    if (nextBtn) {
      // On valide seulement quand on clique sur suivant
      const inputs = [...formSteps[currentStep].querySelectorAll("input")].filter(
        input => !input.disabled && input.offsetParent !== null
      );
      const allValid = inputs.every(input => input.reportValidity());
      if (!allValid) return;

      // Validation custom pour le téléphone (étape 1)
      if (currentStep === 0) {
        const phoneInput = multiStepForm.querySelector("#reserv-phone");
        if (phoneInput && !/^\d{10}$/.test(phoneInput.value)) {
          phoneInput.setCustomValidity("Le numéro doit contenir exactement 10 chiffres.");
          phoneInput.reportValidity();
          phoneInput.setCustomValidity("");
          return;
        }
      }

      // Validation custom pour la carte d'identité (étape 3)
      if (currentStep === 2) {
        const idCardInput = multiStepForm.querySelector("#idCard");
        if (idCardInput && !/^\d{9}$/.test(idCardInput.value)) {
          idCardInput.setCustomValidity("Le numéro de carte doit contenir exactement 9 chiffres.");
          idCardInput.reportValidity();
          idCardInput.setCustomValidity("");
          return;
        }
      }
    }

    currentStep += incrementor;
    showCurrentStep();
  });

  // On écoute les clics sur le bouton "Confirmer" de l'étape calendrier
  multiStepForm.addEventListener("click", function(e) {
    const confirmBtn = e.target.closest("[data-next]");
    if (confirmBtn && currentStep === 3) {
      if (!selectedDate) {
        alert("Veuillez sélectionner une date avant de confirmer.");
        e.preventDefault();
        return;
      }
      // On passe à l'étape de confirmation
      currentStep += 1;
      showCurrentStep();
    }
  });

  function showCurrentStep() {
    formSteps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });
    // On génère le calendrier quand on arrive à l'étape 4 (index 3)
    if (currentStep === 3) {
      generateCalendar();
    }
  }

  // Aller à une étape précise du formulaire multi-étapes
  function goToStep(stepIndex) {
    if (!Array.isArray(formSteps)) return;
    if (stepIndex < 0 || stepIndex >= formSteps.length) return;
    currentStep = stepIndex;
    showCurrentStep();
  }
}
let selectedDate = null;

// Envoi du code de confirmation (factice)
function sendConfirmationCode() {
  const emailInput = multiStepForm.querySelector('#reserv-email');
  const phoneInput = multiStepForm.querySelector('#reserv-phone');
  const codeSection = document.getElementById('codeSection');
  const email = emailInput ? emailInput.value.trim() : '';
  const phone = phoneInput ? String(phoneInput.value).trim() : '';

  if (!email || !phone) {
    alert("Veuillez remplir l'email et le numéro de téléphone.");
    return;
  }


  alert("Code envoyé à " + email);
  if (codeSection) codeSection.style.display = 'block';
}


// Vérification du code de confirmation (factice)
function verifyCode() {
  const codeInput = document.getElementById('confirmationCode');
  const code = codeInput ? codeInput.value : '';
  if (code === '1234') {
    goToStep(3);
  } else {
    alert("Invalid code");
  }
}
function resendCode() {
  sendConfirmationCode();
}

// Générer un calendrier simple avec les dates dispos
function generateCalendar() {
  const availableDates = ['2025-05-20', '2025-05-21', '2025-05-25', '2025-05-28'];
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;
  calendarEl.innerHTML = '';

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    calendarEl.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEl = document.createElement('div');
    dayEl.classList.add('calendar-day');
    dayEl.textContent = day;

    if (availableDates.includes(dateStr)) {
      dayEl.classList.add('available');
      dayEl.addEventListener('click', () => {
        calendarEl.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
        dayEl.classList.add('selected');
        selectedDate = dateStr;
      });
    } else {
      dayEl.classList.add('unavailable');
    }

    calendarEl.appendChild(dayEl);
  }
}

// Confirmer la réservation après avoir choisi une date
function confirmBooking() {
  if (!selectedDate) {
    alert("Please select a date before confirming.");
    return;
  }
  goToStep(4);
}