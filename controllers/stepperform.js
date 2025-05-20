let selectedDate = null;
let currentStep = 1;
const totalSteps = 4;

function goToStep(stepNumber) {
  for (let i = 1; i <= totalSteps; i++) {
    const stepEl = document.getElementById(`step${i}`);
    if (i === stepNumber) {
      stepEl.classList.add('stepactive');
      stepEl.classList.remove('step');
    } else {
      stepEl.classList.remove('stepactive');
      stepEl.classList.add('step');
    }
  }
  currentStep = stepNumber;
}
function sendConfirmationCode() {
  const email = document.getElementById('reserv-email').value.trim();
  const phone = String(document.getElementById('reserv-phone').value).trim();

  if (!email || !phone) {
    alert("Veuillez remplir l'email et le numéro de téléphone.");
    return;
  }

  // Simulate sending
  alert("Code envoyé à " + email);
  document.getElementById('codeSection').style.display = 'block';
}

  function verifyCode() {
    const code = document.getElementById('confirmationCode').value;
    if (code === '1234') { // mock check
      goToStep(2);
    } else {
      alert("Invalid code");
    }
  }


  function generateCalendar() {
    const availableDates = ['2025-05-20', '2025-05-21', '2025-05-25', '2025-05-28'];
    const calendarEl = document.getElementById('calendar');
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
      const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEl = document.createElement('div');
      dayEl.classList.add('calendar-day');
      dayEl.textContent = day;

      if (availableDates.includes(dateStr)) {
        dayEl.classList.add('available');
        dayEl.addEventListener('click', () => {
          document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
          dayEl.classList.add('selected');
          selectedDate = dateStr;
        });
      } else {
        dayEl.classList.add('unavailable');
      }

      calendarEl.appendChild(dayEl);
    }
  }

  function confirmBooking() {
    if (!selectedDate) {
      alert("Please select a date before confirming.");
      return;
    }
    goToStep(4);
  }