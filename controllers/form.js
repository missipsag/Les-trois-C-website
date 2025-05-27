document.querySelectorAll("[data-multi-step]").forEach(multiStepForm => {
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
        const tel = multiStepForm.querySelector('[name="tel"]').value.trim();
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
  }

  // Aller à une étape précise du formulaire multi-étapes
  function goToStep(stepIndex) {
    if (!Array.isArray(formSteps)) return;
    if (stepIndex < 0 || stepIndex >= formSteps.length) return;
    currentStep = stepIndex;
    showCurrentStep();
  }
  
  // Boutton de confirmation finalee
  const finalConfirmBtn = multiStepForm.closest("dialog")?.querySelector("#final-confirm-btn");
  if (finalConfirmBtn) {
    finalConfirmBtn.addEventListener("click", function() {

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
});
