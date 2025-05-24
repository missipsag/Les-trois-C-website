document.addEventListener("DOMContentLoaded", function() {
  const step1 = document.getElementById('reservation-step1');
  const step2 = document.getElementById('reservation-step2');
  const step3 = document.getElementById('reservation-step3');

  if (step1) {
    step1.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = step1.querySelector('[name="email"]').value.trim();
      if (!email) {
        alert("Veuillez remplir l'email");
        return;
      }
      // TODO: backend verification,logique...
      step1.style.display = 'none';
      if (step2) step2.style.display = 'block';
    });
  }

  if (step2) {
    step2.addEventListener('submit', function(e) {
      e.preventDefault();
      const code = step2.querySelector('[name="otp"]').value.trim();
      if (!code) {
        alert("Veuillez entrer le code de vérification.");
        return;
      }
      // TODO: bacckend verification, logique...
      step2.style.display = 'none';
      if (step3) step3.style.display = 'block';
    });
  }

  // Optional: resend code
  window.resendCode = function() {
    // TODO: backend...
    alert("Code renvoyé !");
  };
});