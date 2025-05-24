const openButtons = document.querySelectorAll("[data-open-modal]");
const closeButtons = document.querySelectorAll("[data-close-modal]");
document.addEventListener("DOMContentLoaded", function() {
    //prendre les variables
    const titre = document.getElementById("nomES");
    const type = document.getElementById("typeEspace");
    const buttons = document.querySelectorAll(".book-btn")

    buttons.forEach(Btn =>{
        Btn.addEventListener("click", function() {
            const espace = Btn.dataset.espace;
            titre.textContent = espace;
            type.value = espace;

        })
    })
    // Ouvrir la modal
    document.querySelectorAll("[data-open-modal]").forEach(button => {
        button.addEventListener("click", () => {
            const modalNum = button.getAttribute("data-open-modal");
            const dialog = document.querySelector(`dialog[data-modal="${modalNum}"]`);
            if (dialog) dialog.showModal();
        });
    });

    // Fermer modal
    document.querySelectorAll("[data-close-modal]").forEach(button => {
        button.addEventListener("click", () => {
            const modalNum = button.getAttribute("data-close-modal");
            const dialog = document.querySelector(`dialog[data-modal="${modalNum}"]`);
            if (dialog) dialog.close();
        });
    });

    // eviter de fermer on cliquer dehors
    document.querySelectorAll("dialog").forEach(dialog => {
        dialog.addEventListener("cancel", (e) => {
            e.preventDefault();
        });
        dialog.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    });
});




