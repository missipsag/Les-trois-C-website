// function isVisible(el) {
//   // offsetParent is null if element or any ancestor has display:none
//   return !!(el.offsetParent);
// }

// /**
//  * Walks all inputs in your 3-step wizard and toggles the 'required'
//  * attribute based on whether their form container is visible.
//  */
// function updateRequiredFields() {
//   // list your step containers by ID
//   const steps = [
//     document.getElementById('reservation-step1'),
//     document.getElementById('reservation-step2'),
//     document.getElementById('reservation-step3'),
//   ];
  
//   steps.forEach(step => {
//     if (!step) return; 
//     const visible = isVisible(step);
//     step.querySelectorAll('input, select, textarea').forEach(field => {
//       field.required = visible;    // true/false toggles the attribute
//     });
//   });
// }


function disableInputs(step) {
    step.querySelectorAll('input, select, textarea').forEach(field => {
        field.disabled = true; // Disable all fields in the step
    });

}

document.addEventListener("DOMContentLoaded", function () {
    const step1 = document.getElementById('reservation-step1');
    const step2 = document.getElementById('reservation-step2');
    const step3 = document.getElementById('reservation-step3');


    if (step1) {
        step1.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log("###### Step 2 :", step2)
            const email = step1.querySelector('[name="email"]').value.trim();
            console.log("##### email: ",email)
            try {
                const res = await fetch('/auth/authentification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();

                if (!res.ok) {
                    // show server-side validation errors, if any
                    return alert(data.message || 'Erreur lors de l’envoi de l’OTP');
                }

                step1.style.display = 'none';
                step1.setAttribute('novalidate', 'novalidate'); // Disable validation for step 1
                disableInputs(step1); // Disable all inputs in step 1
                step2.style.display = 'block';
               // updateRequiredFields(); // Update required fields for step 2

            } catch (err) {
                console.error(err);
                alert('Impossible de contacter le serveur.');
            }
        });
     }
            

    if (step2) {
        step2.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log("##### before received otp")
            const receivedOtp = step2.querySelector('[name="otp"]').value.trim();
            console.log("otpCode :", receivedOtp);

            try {
                const res = await fetch('/auth/otpVerification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ receivedOtp })
                }); 

                const data = await res.json(); 

                if (!res.ok) {
                    // show server-side validation errors, if any
                    return alert(data.message || 'Erreur lors de la verification de l\'otp');
                }

            } catch (error) {
                console.error(error);
                alert('Impossible de contacter le serveur.');
            }
            // TODO: bacckend verification, logique...
            step2.style.display = 'none';
            step2.setAttribute('novalidate', 'novalidate'); // Disable validation for step 2
            disableInputs(step2)
            if (step3) step3.style.display = 'block';
            //updateRequiredFields(); // Update required fields for step 3
        });
    }

    if (step3) {
        step3.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log("##### inside step 3 submit handler");
            
            const firstName = step3.querySelector('[name="firstName"]').value.trim();
            const lastName = step3.querySelector('[name="lastName"]').value.trim();
            const NID = step3.querySelector('[name="NID"]').value.trim();
            const phone = step3.querySelector('[name="phone"]').value.trim();

            console.log("##### firstName : ", firstName);   
            console.log("##### lastName : ", lastName);         
            console.log("##### NID : ", NID);
            console.log("##### phone : ", phone);

            try {
                const res = await fetch('/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, NID, phone })
                });

                const data = await res.json();

                if (!res.ok) {
                    // show server-side validation errors, if any
                    return alert(data.message || 'Erreur lors de la finalisation de l’inscription');
                }

                //updateRequiredFields(); // Update required fields for step 3
            
                alert('Inscription réussie !');
                

            } catch (error) {
                console.error(error);
                alert('Impossible de contacter le serveur.');
            }
        });
    }

    // Optional: resend code
    window.resendCode = function () {
        // TODO: backend...
        alert("Code renvoyé !");
    };
});