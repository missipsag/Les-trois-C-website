document.addEventListener('DOMContentLoaded', function() {
    // Get all tab buttons and content
    const tabButtons = document.querySelectorAll('.service-tabs .tab-btn');
    const tabPanes = document.querySelectorAll('.tab-content .tab-pane');
    
    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab panes
            tabPanes.forEach(pane => {
                pane.classList.remove('show');
                pane.classList.remove('active');
            });
            
            // Show the corresponding tab pane
            const targetId = this.getAttribute('aria-controls');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('show');
                targetPane.classList.add('active');
            }
        });
    });
});