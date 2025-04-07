// Global variables
let currentUser = null;
let rooms = [];
let services = [];
let selectedServices = [];
let currentTotal = 0;

// Initialize the app
function init() {
    checkAuthentication();
    loadData();
    setMinDate();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    const elements = {
        eventType: document.getElementById('eventType'),
        room: document.getElementById('room'),
        guestCount: document.getElementById('guestCount'),
        paymentOption: document.getElementById('paymentOption'),
        paymentMethod: document.getElementById('paymentMethod'),
        bookingForm: document.getElementById('bookingForm'),
        navToggle: document.getElementById('navToggle'),
        logoutBtn: document.getElementById('logoutBtn'),
        confirmBookingBtn: document.getElementById('confirmBooking'),
        cancelBookingBtn: document.getElementById('cancelBooking'),
        closeModalBtns: document.querySelectorAll('.close-modal'),
        modalClose: document.getElementById('modalClose')
    };
    
    // Add event listeners
    elements.eventType.addEventListener('change', onEventTypeChange);
    elements.room.addEventListener('change', updatePrice);
    elements.guestCount.addEventListener('input', updatePrice);
    elements.paymentOption.addEventListener('change', updatePrice);
    elements.paymentMethod.addEventListener('change', updatePrice);
    elements.bookingForm.addEventListener('submit', handleBookingSubmit);
    elements.navToggle.addEventListener('click', toggleMobileMenu);
    elements.logoutBtn.addEventListener('click', handleLogout);
    elements.confirmBookingBtn.addEventListener('click', confirmBooking);
    elements.cancelBookingBtn.addEventListener('click', closeConfirmationModal);
    elements.closeModalBtns.forEach(btn => btn.addEventListener('click', closeAllModals));
    elements.modalClose.addEventListener('click', closeMessageModal);
}

// Check if user is authenticated
function checkAuthentication() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Check if user is admin
    const adminLink = document.getElementById('adminLink');
    if (currentUser.role === 'admin') {
        adminLink.classList.remove('hidden');
    } else {
        adminLink.classList.add('hidden');
    }
}

// Load data from localStorage
function loadData() {
    rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    services = JSON.parse(localStorage.getItem('services')) || [];
    
    // Populate rooms dropdown
    populateRooms();
}

// Set minimum date for event date
function setMinDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDate = document.getElementById('eventDate');
    eventDate.min = tomorrow.toISOString().split('T')[0];
}

// Populate rooms dropdown
function populateRooms() {
    const room = document.getElementById('room');
    room.innerHTML = '<option value="">Sélectionnez une salle</option>';
    
    rooms.filter(r => r.available).forEach(r => {
        const option = document.createElement('option');
        option.value = r.id;
        option.textContent = `${r.name} (Capacité: ${r.capacity} personnes - ${r.price}€)`;
        room.appendChild(option);
    });
}

// Handle event type change
function onEventTypeChange() {
    const type = eventType.value;
    
    if (type) {
        renderServiceOptions(type);
    } else {
        serviceOptions.innerHTML = '';
    }
    
    updatePrice();
}

// Render service options based on event type
function renderServiceOptions(eventType) {
    // Clear selected services
    selectedServices = [];
    
    // Filter services by event type
    const filteredServices = services.filter(s => s.type === eventType && s.available);
    
    // Group services by category
    const servicesByCategory = groupBy(filteredServices, 'category');
    
    // Clear service options
    serviceOptions.innerHTML = '';
    
    // Create heading
    const heading = document.createElement('h3');
    heading.textContent = 'Services optionnels';
    serviceOptions.appendChild(heading);
    
    // Render services by category
    Object.entries(servicesByCategory).forEach(([category, categoryServices]) => {
        // Create category heading
        const categoryHeading = document.createElement('h4');
        categoryHeading.textContent = formatCategoryName(category);
        categoryHeading.className = 'service-category';
        serviceOptions.appendChild(categoryHeading);
        
        // Create service items
        categoryServices.forEach(service => {
            const serviceItem = createServiceElement(service);
            serviceOptions.appendChild(serviceItem);
        });
    });
}

// Create service element
function createServiceElement(service) {
    const serviceItem = document.createElement('div');
    serviceItem.className = 'service-item';
    
    const serviceInfo = document.createElement('div');
    serviceInfo.className = 'service-info';
    
    const serviceName = document.createElement('div');
    serviceName.className = 'service-name';
    serviceName.textContent = service.name;
    
    const servicePrice = document.createElement('div');
    servicePrice.className = 'service-price';
    servicePrice.textContent = `${service.price}€`;
    
    serviceInfo.appendChild(serviceName);
    serviceInfo.appendChild(servicePrice);
    
    const serviceControls = document.createElement('div');
    serviceControls.className = 'service-controls';
    
    const quantityControl = document.createElement('div');
    quantityControl.className = 'quantity-control';
    
    const decrementBtn = document.createElement('button');
    decrementBtn.type = 'button';
    decrementBtn.className = 'quantity-btn';
    decrementBtn.textContent = '-';
    decrementBtn.addEventListener('click', () => decrementService(service.id));
    
    const quantityValue = document.createElement('span');
    quantityValue.className = 'quantity-value';
    quantityValue.id = `quantity-${service.id}`;
    quantityValue.textContent = '0';
    
    const incrementBtn = document.createElement('button');
    incrementBtn.type = 'button';
    incrementBtn.className = 'quantity-btn';
    incrementBtn.textContent = '+';
    incrementBtn.addEventListener('click', () => incrementService(service.id, service.name, service.price));
    
    quantityControl.appendChild(decrementBtn);
    quantityControl.appendChild(quantityValue);
    quantityControl.appendChild(incrementBtn);
    
    serviceControls.appendChild(quantityControl);
    
    serviceItem.appendChild(serviceInfo);
    serviceItem.appendChild(serviceControls);
    
    return serviceItem;
}

// Increment service quantity
function incrementService(serviceId, serviceName, servicePrice) {
    const quantityElement = document.getElementById(`quantity-${serviceId}`);
    const currentQuantity = parseInt(quantityElement.textContent);
    
    // Find if service already exists in selected services
    const existingService = selectedServices.find(s => s.id === serviceId);
    
    if (existingService) {
        existingService.quantity = currentQuantity + 1;
    } else {
        selectedServices.push({
            id: serviceId,
            name: serviceName,
            price: servicePrice,
            quantity: 1
        });
    }
    
    quantityElement.textContent = existingService ? existingService.quantity : 1;
    updatePrice();
}

// Decrement service quantity
function decrementService(serviceId) {
    const quantityElement = document.getElementById(`quantity-${serviceId}`);
    const currentQuantity = parseInt(quantityElement.textContent);
    
    if (currentQuantity > 0) {
        // Find service in selected services
        const existingServiceIndex = selectedServices.findIndex(s => s.id === serviceId);
        
        if (existingServiceIndex !== -1) {
            if (currentQuantity === 1) {
                // Remove service if quantity becomes 0
                selectedServices.splice(existingServiceIndex, 1);
            } else {
                // Decrease quantity
                selectedServices[existingServiceIndex].quantity = currentQuantity - 1;
            }
        }
        
        quantityElement.textContent = currentQuantity - 1;
        updatePrice();
    }
}

// Update price calculation
function updatePrice() {
    const selectedRoomId = room.value;
    const guests = parseInt(guestCount.value) || 0;
    
    // Calculate room price
    let roomPrice = 0;
    let selectedRoom = null;
    
    if (selectedRoomId) {
        selectedRoom = rooms.find(r => r.id === selectedRoomId);
        if (selectedRoom) {
            roomPrice = selectedRoom.price;
        }
    }
    
    // Calculate services price
    let servicesPrice = 0;
    
    selectedServices.forEach(service => {
        servicesPrice += service.price * service.quantity;
    });
    
    // Calculate total price
    const total = roomPrice + servicesPrice;
    currentTotal = total;
    
    // Update price details
    priceDetails.innerHTML = '';
    
    if (selectedRoom) {
        addPriceDetail('Salle', `${selectedRoom.name}`, roomPrice);
    }
    
    // Group services for display
    const groupedServices = {};
    selectedServices.forEach(service => {
        if (!groupedServices[service.name]) {
            groupedServices[service.name] = { price: service.price, quantity: service.quantity };
        } else {
            groupedServices[service.name].quantity += service.quantity;
        }
    });
    
    // Add service details
    Object.entries(groupedServices).forEach(([name, detail]) => {
        addPriceDetail(name, `${detail.quantity} × ${detail.price}€`, detail.price * detail.quantity);
    });
    
    // Update total price display
    totalPrice.textContent = total.toLocaleString('fr-FR');
}

// Add price detail row
function addPriceDetail(name, description, price) {
    const detailRow = document.createElement('div');
    detailRow.className = 'price-detail';
    
    const detailName = document.createElement('div');
    detailName.className = 'detail-name';
    detailName.textContent = name;
    
    const detailDescription = document.createElement('div');
    detailDescription.className = 'detail-description';
    detailDescription.textContent = description;
    
    const detailPrice = document.createElement('div');
    detailPrice.className = 'detail-price';
    detailPrice.textContent = `${price.toLocaleString('fr-FR')}€`;
    
    detailRow.appendChild(detailName);
    detailRow.appendChild(detailDescription);
    detailRow.appendChild(detailPrice);
    
    priceDetails.appendChild(detailRow);
}

// Handle booking form submission
function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Prepare booking summary
    prepareBookingSummary();
    
    // Show confirmation modal
    confirmationModal.style.display = 'block';
}

// Validate booking form
function validateForm() {
    const selectedRoomId = room.value;
    const type = eventType.value;
    const date = eventDate.value;
    const guests = parseInt(guestCount.value) || 0;
    
    if (!type) {
        showMessage('Veuillez sélectionner un type d\'événement.');
        return false;
    }
    
    if (!date) {
        showMessage('Veuillez sélectionner une date.');
        return false;
    }
    
    if (!selectedRoomId) {
        showMessage('Veuillez sélectionner une salle.');
        return false;
    }
    
    if (guests <= 0) {
        showMessage('Veuillez indiquer un nombre d\'invités valide.');
        return false;
    }
    
    const selectedRoom = rooms.find(r => r.id === selectedRoomId);
    if (guests > selectedRoom.capacity) {
        showMessage(`La salle sélectionnée ne peut accueillir que ${selectedRoom.capacity} personnes maximum.`);
        return false;
    }
    
    // Check if the room is already booked on that date
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const conflictingBooking = bookings.find(b => 
        b.roomId === selectedRoomId && 
        b.date === date && 
        b.status !== 'cancelled'
    );
    
    if (conflictingBooking) {
        showMessage('Cette salle est déjà réservée à cette date.');
        return false;
    }
    
    return true;
}

// Prepare booking summary for confirmation modal
function prepareBookingSummary() {
    const selectedRoomId = room.value;
    const type = eventType.value;
    const date = eventDate.value;
    const guests = parseInt(guestCount.value) || 0;
    const payment = paymentOption.value;
    const method = paymentMethod.value;
    
    const selectedRoom = rooms.find(r => r.id === selectedRoomId);
    
    // Format date
    const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create summary HTML
    let summaryHTML = `
        <div class="booking-summary-content">
            <div class="summary-row"><span>Type d'événement:</span> <span>${formatEventType(type)}</span></div>
            <div class="summary-row"><span>Date:</span> <span>${formattedDate}</span></div>
            <div class="summary-row"><span>Salle:</span> <span>${selectedRoom.name}</span></div>
            <div class="summary-row"><span>Invités:</span> <span>${guests} personnes</span></div>
            <div class="summary-row"><span>Option de paiement:</span> <span>${formatPaymentOption(payment)}</span></div>
            <div class="summary-row"><span>Méthode de paiement:</span> <span>${formatPaymentMethod(method)}</span></div>
            <div class="summary-row"><span>Prix total:</span> <span>${currentTotal.toLocaleString('fr-FR')}€</span></div>
    `;
    
    // Add services if any
    if (selectedServices.length > 0) {
        summaryHTML += `<div class="summary-services"><h4>Services sélectionnés:</h4><ul>`;
        
        // Group services by name
        const groupedServices = {};
        selectedServices.forEach(service => {
            if (!groupedServices[service.name]) {
                groupedServices[service.name] = { price: service.price, quantity: service.quantity };
            } else {
                groupedServices[service.name].quantity += service.quantity;
            }
        });
        
        Object.entries(groupedServices).forEach(([name, detail]) => {
            summaryHTML += `<li>${name}: ${detail.quantity} × ${detail.price}€ = ${(detail.price * detail.quantity).toLocaleString('fr-FR')}€</li>`;
        });
        
        summaryHTML += `</ul></div>`;
    }
    
    summaryHTML += `</div>`;
    
    // Update booking summary
    bookingSummary.innerHTML = summaryHTML;
}

// Confirm booking
function confirmBooking() {
    const selectedRoomId = room.value;
    const type = eventType.value;
    const date = eventDate.value;
    const guests = parseInt(guestCount.value) || 0;
    const payment = paymentOption.value;
    const method = paymentMethod.value;
    
    // Calculate payment amounts
    let firstPayment = 0;
    let secondPayment = 0;
    let finalPayment = 0;
    
    if (payment === 'installments') {
        firstPayment = Math.round(currentTotal * 0.3);
        secondPayment = Math.round(currentTotal * 0.5);
        finalPayment = currentTotal - firstPayment - secondPayment;
    } else {
        firstPayment = currentTotal;
    }
    
    // Create booking object
    const booking = {
        id: generateId(),
        userId: currentUser.id,
        type,
        date,
        roomId: selectedRoomId,
        guestCount: guests,
        services: selectedServices,
        payment: {
            option: payment,
            method,
            total: currentTotal,
            firstPayment,
            secondPayment,
            finalPayment,
            firstPaymentStatus: method === 'online' ? 'paid' : 'pending',
            secondPaymentStatus: 'pending',
            finalPaymentStatus: 'pending'
        },
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Get existing bookings
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    // Add new booking
    bookings.push(booking);
    
    // Save to localStorage
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Close confirmation modal
    closeConfirmationModal();
    
    // Show success message
    showMessage('Votre réservation a été enregistrée avec succès! Vous recevrez une confirmation dès qu\'elle sera approuvée.');
    
    // Reset form
    resetForm();
}

// Reset form
function resetForm() {
    bookingForm.reset();
    selectedServices = [];
    serviceOptions.innerHTML = '';
    priceDetails.innerHTML = '';
    totalPrice.textContent = '0';
}

// Close confirmation modal
function closeConfirmationModal() {
    confirmationModal.style.display = 'none';
}

// Close all modals
function closeAllModals() {
    confirmationModal.style.display = 'none';
    messageModal.style.display = 'none';
}

// Close message modal
function closeMessageModal() {
    messageModal.style.display = 'none';
}

// Show message
function showMessage(message) {
    modalMessage.textContent = message;
    messageModal.style.display = 'block';
}

// Toggle mobile menu
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Utility Functions
// Group array by property
function groupBy(array, key) {
    return array.reduce((result, item) => {
        (result[item[key]] = result[item[key]] || []).push(item);
        return result;
    }, {});
}

// Generate ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Format category name
function formatCategoryName(category) {
    const categoryNames = {
        'menu': 'Menus',
        'patisserie': 'Pâtisserie',
        'decoration': 'Décoration',
        'media': 'Services média',
        'equipment': 'Équipement',
        'catering': 'Restauration',
        'setup': 'Installation',
        'staff': 'Personnel',
        'animation': 'Animation'
    };
    
    return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

// Format event type
function formatEventType(type) {
    const types = {
        'mariage': 'Mariage',
        'congres': 'Congrès',
        'khitan': 'Khitan'
    };
    
    return types[type] || type;
}

// Format payment option
function formatPaymentOption(option) {
    const options = {
        'full': 'Paiement complet',
        'installments': 'Paiement en plusieurs tranches (30%-50%-20%)'
    };
    
    return options[option] || option;
}

// Format payment method
function formatPaymentMethod(method) {
    const methods = {
        'online': 'En ligne (carte bancaire, virement)',
        'cash': 'En espèces (sur place)'
    };
    
    return methods[method] || method;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
