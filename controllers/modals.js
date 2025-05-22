const openButtons = document.querySelectorAll("[data-open-modal]");
const closeButtons = document.querySelectorAll("[data-close-modal]");
document.addEventListener("DOMContentLoaded", function() {
    // Open modal on [data-open-modal] click
    document.querySelectorAll("[data-open-modal]").forEach(button => {
        button.addEventListener("click", () => {
            const modalNum = button.getAttribute("data-open-modal");
            const dialog = document.querySelector(`dialog[data-modal="${modalNum}"]`);
            if (dialog) dialog.showModal();
        });
    });

    // Close modal on [data-close-modal] click
    document.querySelectorAll("[data-close-modal]").forEach(button => {
        button.addEventListener("click", () => {
            const modalNum = button.getAttribute("data-close-modal");
            const dialog = document.querySelector(`dialog[data-modal="${modalNum}"]`);
            if (dialog) dialog.close();
        });
    });

    // Prevent closing by clicking outside or pressing Escape
    document.querySelectorAll("dialog").forEach(dialog => {
        dialog.addEventListener("cancel", (e) => {
            e.preventDefault();
        });
        dialog.addEventListener("click", (e) => {
            // Do nothing on backdrop click
            e.stopPropagation();
        });
    });
});




