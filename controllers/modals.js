
const openButtons = document.querySelectorAll("[data-open-modal]");
const closeButtons = document.querySelectorAll("[data-close-modal]");
document.addEventListener("DOMContentLoaded", function() {
    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modalNum = button.getAttribute("data-open-modal");
            const dialog = document.querySelector(`dialog[data-modal="${modalNum}"]`);
            dialog.showModal();
        });
    });
    closeButtons.forEach(button => {
        button.addEventListener("click",()=> {
            const modalCNum = button.getAttribute("data-close-modal");
            const dialog = document.querySelector(`dialog[data-modal="${modalCNum}"]`);
            dialog.close();
        })
    })
});

const dialogs = document.querySelectorAll("dialog");
dialogs.forEach(dialog => {
    dialog.addEventListener("click", e => {
        const dialogDimensions = dialog.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dialog.close();
        }
    });
});




