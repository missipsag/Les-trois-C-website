// DOM Elements
const bookingsTable = document.getElementById('bookingsTable');
const roomsTable = document.getElementById('roomsTable');
const servicesTable = document.getElementById('servicesTable');
const usersTable = document.getElementById('usersTable');
const tabButtons = document.querySelectorAll('.admin-tabs .tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const serviceTypeButtons = document.querySelectorAll('.service-types .tab-btn');
const addRoomBtn = document.getElementById('addRoomBtn');
const addServiceBtn = document.getElementById('addServiceBtn');
const roomModal = document.getElementById('roomModal');
const serviceModal = document.getElementById('serviceModal');
const roomForm = document.getElementById('roomForm');
const serviceForm = document.getElementById('serviceForm');
const roomId = document.getElementById('roomId');
const roomName = document.getElementById('roomName');
const roomCapacity = document.getElementById('roomCapacity');
const roomPrice = document.getElementById('roomPrice');
const roomAvailable = document.getElementById('roomAvailable');
const serviceId = document.getElementById('serviceId');
const serviceName = document.getElementById('serviceName');
const serviceType = document.getElementById('serviceType');
const servicePrice = document.getElementById('servicePrice');
const serviceAvailable = document.getElementById('serviceAvailable');
const roomModalTitle = document.getElementById('roomModalTitle');
const serviceModalTitle = document.getElementById('serviceModalTitle');
const cancelRoomBtn = document.getElementById('cancelRoomBtn');
const cancelServiceBtn = document.getElementById('cancelServiceBtn');
const bookingDetailModal = document.getElementById('bookingDetailModal');
const bookingDetailContent = document.getElementById('bookingDetailContent');
const bookingStatus = document.getElementById('bookingStatus');
const updateBookingBtn = document.getElementById('updateBookingBtn');
const closeBookingDetailBtn = document.getElementById('closeBookingDetailBtn');
const bookingStatusFilter = document.getElementById('bookingStatusFilter');
const bookingDateFilter = document.getElementById('bookingDateFilter');
const applyFilters = document.getElementById('applyFilters');
const resetFilters = document.getElementById('resetFilters');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const logoutBtn = document.getElementById('logoutBtn');
const messageModal = document.getElementById('messageModal');
const modalMessage = document.getElementById('modalMessage');
const modalClose = document.getElementById('modalClose');

// Global variables
let currentUser = null;
let rooms = [];
let services = [];
let bookings = [];
let users = [];
let currentBookingId = null;
let currentEventType = 'mariage';
let currentFilters = {
    status: 'all',
    date: ''
};

// Initialize the app
function init() {
    checkAuthentication();
    loadData();
    
    // Event Listeners
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    serviceTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => switchServiceType(btn.dataset.service));
    });
    
    addRoomBtn.addEventListener('click', showAddRoomModal);
    addServiceBtn.addEventListener('click', showAddServiceModal);
    roomForm.addEventListener('submit', handleRoomFormSubmit);
    serviceForm.addEventListener('submit', handleServiceFormSubmit);
    cancelRoomBtn.addEventListener('click', closeRoomModal);
    cancelServiceBtn.addEventListener('click', closeServiceModal);
    updateBookingBtn.addEventListener('click', updateBookingStatus);
    closeBookingDetailBtn.addEventListener('click', closeBookingDetailModal);
    applyFilters.addEventListener('click', handleFilterBookings);
    resetFilters.addEventListener('click', resetBookingFilters);
    navToggle.addEventListener('click', toggleMobileMenu);
    logoutBtn.addEventListener('click', handleLogout);
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    modalClose.addEventListener('click', closeMessageModal);
}

// Check if user is authenticated and is admin
function checkAuthentication() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Check if user is admin
    if (currentUser.role !== 'admin') {
        window.location.href = 'booking.html';
    }
}

// Load data from localStorage
function loadData() {
    rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    services = JSON.parse(localStorage.getItem('services')) || [];
    bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    users = JSON.parse(localStorage.getItem('users')) || [];
    
    renderTables();
}

// Render all tables
function renderTables() {
    renderBookingsTable();
    renderRoomsTable();
    renderServicesTable(currentEventType);
    renderUsersTable();
}

// Render bookings table
function renderBookingsTable() {
    const tbody = bookingsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    // Filter bookings
    let filteredBookings = [...bookings];
    
    if (currentFilters.status !== 'all') {
        filteredBookings = filteredBookings.filter(b => b.status === currentFilters.status);
    }
    
    if (currentFilters.date) {
        filteredBookings = filteredBookings.filter(b => b.date === currentFilters.date);
    }
    
    // Sort bookings by date (newer first)
    filteredBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    filteredBookings.forEach(booking => {
        const tr = document.createElement('tr');
        
        // Find user and room
        const user = users.find(u => u.id === booking.userId) || { name: 'Inconnu' };
        const room = rooms.find(r => r.id === booking.roomId) || { name: 'Inconnue' };
        
        // Format date
        const formattedDate = new Date(booking.date).toLocaleDateString('fr-FR');
        
        // Payment status
        let paymentStatus = '';
        if (booking.payment.option === 'full') {
            paymentStatus = formatPaymentStatus(booking.payment.firstPaymentStatus);
        } else {
            // Calculate paid percentage
            let paidPercentage = 0;
            if (booking.payment.firstPaymentStatus === 'paid') paidPercentage += 30;
            if (booking.payment.secondPaymentStatus === 'paid') paidPercentage += 50;
            if (booking.payment.finalPaymentStatus === 'paid') paidPercentage += 20;
            
            paymentStatus = `${paidPercentage}% payé`;
        }
        
        tr.innerHTML = `
            <td>${booking.id.substring(0, 8)}</td>
            <td>${user.name}</td>
            <td>${formatEventType(booking.type)}</td>
            <td>${formattedDate}</td>
            <td>${room.name}</td>
            <td>${booking.guestCount}</td>
            <td>${booking.payment.total.toLocaleString('fr-FR')}€</td>
            <td><span class="status-badge ${booking.status}">${formatStatus(booking.status)}</span></td>
            <td>${paymentStatus}</td>
            <td>
                <div class="action-btns">
                    <button class="btn action-btn" data-action="view" data-id="${booking.id}">Voir</button>
                    <button class="btn action-btn" data-action="cancel" data-id="${booking.id}" ${booking.status === 'cancelled' ? 'disabled' : ''}>Annuler</button>
                </div>
            </td>
        `;
        
        // Add event listeners to action buttons
        tr.querySelector('[data-action="view"]').addEventListener('click', () => showBookingDetails(booking.id));
        tr.querySelector('[data-action="cancel"]').addEventListener('click', () => cancelBooking(booking.id));
        
        tbody.appendChild(tr);
    });
    
    // Show message if no bookings
    if (filteredBookings.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="10" class="no-results">Aucune réservation trouvée</td>`;
        tbody.appendChild(tr);
    }
}

// Render rooms table
function renderRoomsTable() {
    const tbody = roomsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    rooms.forEach(room => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${room.id.substring(0, 8)}</td>
            <td>${room.name}</td>
            <td>${room.capacity}</td>
            <td>${room.price.toLocaleString('fr-FR')}€</td>
            <td>${room.available ? 'Disponible' : 'Non disponible'}</td>
            <td>
                <div class="action-btns">
                    <button class="btn action-btn" data-action="edit" data-id="${room.id}">Modifier</button>
                    <button class="btn action-btn" data-action="toggle" data-id="${room.id}">
                        ${room.available ? 'Désactiver' : 'Activer'}
                    </button>
                </div>
            </td>
        `;
        
        // Add event listeners to action buttons
        tr.querySelector('[data-action="edit"]').addEventListener('click', () => showEditRoomModal(room.id));
        tr.querySelector('[data-action="toggle"]').addEventListener('click', () => toggleRoomAvailability(room.id));
        
        tbody.appendChild(tr);
    });
}

// Render services table
function renderServicesTable(eventType) {
    const tbody = servicesTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    // Filter services by event type
    const filteredServices = services.filter(s => s.type === eventType);
    
    filteredServices.forEach(service => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${service.id.substring(0, 8)}</td>
            <td>${service.name}</td>
            <td>${formatEventType(service.type)}</td>
            <td>${service.price.toLocaleString('fr-FR')}€</td>
            <td>${service.available ? 'Disponible' : 'Non disponible'}</td>
            <td>
                <div class="action-btns">
                    <button class="btn action-btn" data-action="edit" data-id="${service.id}">Modifier</button>
                    <button class="btn action-btn" data-action="toggle" data-id="${service.id}">
                        ${service.available ? 'Désactiver' : 'Activer'}
                    </button>
                </div>
            </td>
        `;
        
        // Add event listeners to action buttons
        tr.querySelector('[data-action="edit"]').addEventListener('click', () => showEditServiceModal(service.id));
        tr.querySelector('[data-action="toggle"]').addEventListener('click', () => toggleServiceAvailability(service.id));
        
        tbody.appendChild(tr);
    });
}

// Render users table
function renderUsersTable() {
    const tbody = usersTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    // Filter out admin users
    const clientUsers = users.filter(u => u.role === 'client');
    
    clientUsers.forEach(user => {
        // Count user bookings
        const userBookings = bookings.filter(b => b.userId === user.id);
        
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${user.id.substring(0, 8)}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'Non renseigné'}</td>
            <td>${userBookings.length}</td>
            <td>
                <div class="action-btns">
                    <button class="btn action-btn" data-action="view-bookings" data-id="${user.id}">Voir réservations</button>
                </div>
            </td>
        `;
        
        // Add event listeners to action buttons
        tr.querySelector('[data-action="view-bookings"]').addEventListener('click', () => filterBookingsByUser(user.id));
        
        tbody.appendChild(tr);
    });
}

// Switch between tabs
function switchTab(tabId) {
    // Hide all tab contents
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    tabButtons.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(`${tabId}Tab`).classList.add('active');
    
    // Add active class to selected tab
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Switch between service types
function switchServiceType(type) {
    currentEventType = type;
    
    // Remove active class from all type buttons
    serviceTypeButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected type button
    document.querySelector(`[data-service="${type}"]`).classList.add('active');
    
    // Render services table with selected type
    renderServicesTable(type);
}

// Show add room modal
function showAddRoomModal() {
    roomModalTitle.textContent = 'Ajouter une salle';
    roomId.value = '';
    roomForm.reset();
    roomModal.style.display = 'block';
}

// Show edit room modal
function showEditRoomModal(id) {
    const room = rooms.find(r => r.id === id);
    
    if (room) {
        roomModalTitle.textContent = 'Modifier la salle';
        roomId.value = room.id;
        roomName.value = room.name;
        roomCapacity.value = room.capacity;
        roomPrice.value = room.price;
        roomAvailable.value = room.available.toString();
        
        roomModal.style.display = 'block';
    }
}

// Show add service modal
function showAddServiceModal() {
    serviceModalTitle.textContent = 'Ajouter un service';
    serviceId.value = '';
    serviceForm.reset();
    serviceType.value = currentEventType;
    serviceModal.style.display = 'block';
}

// Show edit service modal
function showEditServiceModal(id) {
    const service = services.find(s => s.id === id);
    
    if (service) {
        serviceModalTitle.textContent = 'Modifier le service';
        serviceId.value = service.id;
        serviceName.value = service.name;
        serviceType.value = service.type;
        servicePrice.value = service.price;
        serviceAvailable.value = service.available.toString();
        
        serviceModal.style.display = 'block';
    }
}

// Handle room form submission
function handleRoomFormSubmit(e) {
    e.preventDefault();
    
    const id = roomId.value;
    const name = roomName.value.trim();
    const capacity = parseInt(roomCapacity.value);
    const price = parseFloat(roomPrice.value);
    const available = roomAvailable.value === 'true';
    
    if (id) {
        // Update existing room
        const roomIndex = rooms.findIndex(r => r.id === id);
        
        if (roomIndex !== -1) {
            rooms[roomIndex] = {
                ...rooms[roomIndex],
                name,
                capacity,
                price,
                available
            };
            
            showMessage('Salle mise à jour avec succès.');
        }
    } else {
        // Add new room
        const newRoom = {
            id: generateId(),
            name,
            capacity,
            price,
            available
        };
        
        rooms.push(newRoom);
        showMessage('Salle ajoutée avec succès.');
    }
    
    // Save rooms to localStorage
    localStorage.setItem('rooms', JSON.stringify(rooms));
    
    // Update rooms table
    renderRoomsTable();
    
    // Close modal
    closeRoomModal();
}

// Handle service form submission
function handleServiceFormSubmit(e) {
    e.preventDefault();
    
    const id = serviceId.value;
    const name = serviceName.value.trim();
    const type = serviceType.value;
    const price = parseFloat(servicePrice.value);
    const available = serviceAvailable.value === 'true';
    
    if (id) {
        // Update existing service
        const serviceIndex = services.findIndex(s => s.id === id);
        
        if (serviceIndex !== -1) {
            services[serviceIndex] = {
                ...services[serviceIndex],
                name,
                type,
                price,
                available
            };
            
            showMessage('Service mis à jour avec succès.');
        }
    } else {
        // Add new service
        const newService = {
            id: generateId(),
            name,
            type,
            price,
            category: getCategoryFromName(name, type),
            available
        };
        
        services.push(newService);
        showMessage('Service ajouté avec succès.');
    }
    
    // Save services to localStorage
    localStorage.setItem('services', JSON.stringify(services));
    
    // Update services table
    renderServicesTable(currentEventType);
    
    // Close modal
    closeServiceModal();
}

// Toggle room availability
function toggleRoomAvailability(id) {
    const roomIndex = rooms.findIndex(r => r.id === id);
    
    if (roomIndex !== -1) {
        rooms[roomIndex].available = !rooms[roomIndex].available;
        
        // Save rooms to localStorage
        localStorage.setItem('rooms', JSON.stringify(rooms));
        
        // Update rooms table
        renderRoomsTable();
    }
}

// Toggle service availability
function toggleServiceAvailability(id) {
    const serviceIndex = services.findIndex(s => s.id === id);
    
    if (serviceIndex !== -1) {
        services[serviceIndex].available = !services[serviceIndex].available;
        
        // Save services to localStorage
        localStorage.setItem('services', JSON.stringify(services));
        
        // Update services table
        renderServicesTable(currentEventType);
    }
}

// Show booking details
function showBookingDetails(id) {
    const booking = bookings.find(b => b.id === id);
    
    if (booking) {
        currentBookingId = booking.id;
        
        // Find user and room
        const user = users.find(u => u.id === booking.userId) || { name: 'Inconnu', email: 'Inconnu' };
        const room = rooms.find(r => r.id === booking.roomId) || { name: 'Inconnue' };
        
        // Format date
        const formattedDate = new Date(booking.date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create detail content
        let detailHTML = `
            <div class="booking-detail-section">
                <h4>Informations générales</h4>
                <div class="detail-row">
                    <div class="detail-label">Référence:</div>
                    <div class="detail-value">${booking.id}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Type d'événement:</div>
                    <div class="detail-value">${formatEventType(booking.type)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Date:</div>
                    <div class="detail-value">${formattedDate}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Statut:</div>
                    <div class="detail-value"><span class="status-badge ${booking.status}">${formatStatus(booking.status)}</span></div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Date de création:</div>
                    <div class="detail-value">${new Date(booking.createdAt).toLocaleString('fr-FR')}</div>
                </div>
            </div>
            
            <div class="booking-detail-section">
                <h4>Client</h4>
                <div class="detail-row">
                    <div class="detail-label">Nom:</div>
                    <div class="detail-value">${user.name}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Email:</div>
                    <div class="detail-value">${user.email}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Téléphone:</div>
                    <div class="detail-value">${user.phone || 'Non renseigné'}</div>
                </div>
            </div>
            
            <div class="booking-detail-section">
                <h4>Détails de la réservation</h4>
                <div class="detail-row">
                    <div class="detail-label">Salle:</div>
                    <div class="detail-value">${room.name}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Capacité:</div>
                    <div class="detail-value">${room.capacity} personnes</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Invités:</div>
                    <div class="detail-value">${booking.guestCount} personnes</div>
                </div>
            </div>
        `;
        
        // Add services section if there are any
        if (booking.services && booking.services.length > 0) {
            detailHTML += `
                <div class="booking-detail-section">
                    <h4>Services sélectionnés</h4>
                    <div class="services-list">
            `;
            
            booking.services.forEach(service => {
                detailHTML += `
                    <div class="service-list-item">
                        <div>${service.name}</div>
                        <div>${service.quantity} × ${service.price}€ = ${(service.quantity * service.price).toLocaleString('fr-FR')}€</div>
                    </div>
                `;
            });
            
            detailHTML += `
                    </div>
                </div>
            `;
        }
        
        // Add payment section
        detailHTML += `
            <div class="booking-detail-section">
                <h4>Paiement</h4>
                <div class="detail-row">
                    <div class="detail-label">Option de paiement:</div>
                    <div class="detail-value">${booking.payment.option === 'full' ? 'Paiement complet' : 'Paiement en plusieurs tranches'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Méthode de paiement:</div>
                    <div class="detail-value">${booking.payment.method === 'online' ? 'En ligne' : 'En espèces'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Prix total:</div>
                    <div class="detail-value">${booking.payment.total.toLocaleString('fr-FR')}€</div>
                </div>
        `;
        
        if (booking.payment.option === 'installments') {
            detailHTML += `
                <div class="payment-status ${booking.payment.firstPaymentStatus}">
                    <div class="detail-row">
                        <div class="detail-label">Premier paiement (30%):</div>
                        <div class="detail-value">${booking.payment.firstPayment.toLocaleString('fr-FR')}€ - ${formatPaymentStatus(booking.payment.firstPaymentStatus)}</div>
                    </div>
                </div>
                <div class="payment-status ${booking.payment.secondPaymentStatus}">
                    <div class="detail-row">
                        <div class="detail-label">Deuxième paiement (50%):</div>
                        <div class="detail-value">${booking.payment.secondPayment.toLocaleString('fr-FR')}€ - ${formatPaymentStatus(booking.payment.secondPaymentStatus)}</div>
                    </div>
                </div>
                <div class="payment-status ${booking.payment.finalPaymentStatus}">
                    <div class="detail-row">
                        <div class="detail-label">Paiement final (20%):</div>
                        <div class="detail-value">${booking.payment.finalPayment.toLocaleString('fr-FR')}€ - ${formatPaymentStatus(booking.payment.finalPaymentStatus)}</div>
                    </div>
                </div>
            `;
        } else {
            detailHTML += `
                <div class="payment-status ${booking.payment.firstPaymentStatus}">
                    <div class="detail-row">
                        <div class="detail-label">Paiement:</div>
                        <div class="detail-value">${booking.payment.firstPayment.toLocaleString('fr-FR')}€ - ${formatPaymentStatus(booking.payment.firstPaymentStatus)}</div>
                    </div>
                </div>
            `;
        }
        
        detailHTML += `
            </div>
        `;
        
        // Update booking detail content
        bookingDetailContent.innerHTML = detailHTML;
        
        // Set current status in select
        bookingStatus.value = booking.status;
        
        // Show booking detail modal
        bookingDetailModal.style.display = 'block';
    }
}

// Update booking status
function updateBookingStatus() {
    const newStatus = bookingStatus.value;
    
    const bookingIndex = bookings.findIndex(b => b.id === currentBookingId);
    
    if (bookingIndex !== -1) {
        bookings[bookingIndex].status = newStatus;
        
        // Save bookings to localStorage
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Update bookings table
        renderBookingsTable();
        
        showMessage('Statut de la réservation mis à jour avec succès.');
    }
    
    // Close booking detail modal
    closeBookingDetailModal();
}

// Cancel booking
function cancelBooking(id) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
        const bookingIndex = bookings.findIndex(b => b.id === id);
        
        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'cancelled';
            
            // Save bookings to localStorage
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            // Update bookings table
            renderBookingsTable();
            
            showMessage('Réservation annulée avec succès.');
        }
    }
}

// Filter bookings by user
function filterBookingsByUser(userId) {
    // Reset date filter
    bookingDateFilter.value = '';
    currentFilters.date = '';
    
    // Set current tab to bookings
    switchTab('bookings');
    
    // Show only bookings for the selected user
    const userBookings = bookings.filter(b => b.userId === userId);
    
    if (userBookings.length > 0) {
        // Render only user bookings
        const tbody = bookingsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        userBookings.forEach(booking => {
            const tr = document.createElement('tr');
            
            // Find user and room
            const user = users.find(u => u.id === booking.userId) || { name: 'Inconnu' };
            const room = rooms.find(r => r.id === booking.roomId) || { name: 'Inconnue' };
            
            // Format date
            const formattedDate = new Date(booking.date).toLocaleDateString('fr-FR');
            
            // Payment status
            let paymentStatus = '';
            if (booking.payment.option === 'full') {
                paymentStatus = formatPaymentStatus(booking.payment.firstPaymentStatus);
            } else {
                // Calculate paid percentage
                let paidPercentage = 0;
                if (booking.payment.firstPaymentStatus === 'paid') paidPercentage += 30;
                if (booking.payment.secondPaymentStatus === 'paid') paidPercentage += 50;
                if (booking.payment.finalPaymentStatus === 'paid') paidPercentage += 20;
                
                paymentStatus = `${paidPercentage}% payé`;
            }
            
            tr.innerHTML = `
                <td>${booking.id.substring(0, 8)}</td>
                <td>${user.name}</td>
                <td>${formatEventType(booking.type)}</td>
                <td>${formattedDate}</td>
                <td>${room.name}</td>
                <td>${booking.guestCount}</td>
                <td>${booking.payment.total.toLocaleString('fr-FR')}€</td>
                <td><span class="status-badge ${booking.status}">${formatStatus(booking.status)}</span></td>
                <td>${paymentStatus}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn action-btn" data-action="view" data-id="${booking.id}">Voir</button>
                        <button class="btn action-btn" data-action="cancel" data-id="${booking.id}" ${booking.status === 'cancelled' ? 'disabled' : ''}>Annuler</button>
                    </div>
                </td>
            `;
            
            // Add event listeners to action buttons
            tr.querySelector('[data-action="view"]').addEventListener('click', () => showBookingDetails(booking.id));
            tr.querySelector('[data-action="cancel"]').addEventListener('click', () => cancelBooking(booking.id));
            
            tbody.appendChild(tr);
        });
    } else {
        showMessage('Ce client n\'a pas de réservations.');
    }
}

// Handle filter bookings
function handleFilterBookings() {
    currentFilters.status = bookingStatusFilter.value;
    currentFilters.date = bookingDateFilter.value;
    
    renderBookingsTable();
}

// Reset booking filters
function resetBookingFilters() {
    bookingStatusFilter.value = 'all';
    bookingDateFilter.value = '';
    
    currentFilters.status = 'all';
    currentFilters.date = '';
    
    renderBookingsTable();
}

// Close room modal
function closeRoomModal() {
    roomModal.style.display = 'none';
}

// Close service modal
function closeServiceModal() {
    serviceModal.style.display = 'none';
}

// Close booking detail modal
function closeBookingDetailModal() {
    bookingDetailModal.style.display = 'none';
}

// Close all modals
function closeAllModals() {
    roomModal.style.display = 'none';
    serviceModal.style.display = 'none';
    bookingDetailModal.style.display = 'none';
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
// Generate ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
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

// Format status
function formatStatus(status) {
    const statuses = {
        'pending': 'En attente',
        'confirmed': 'Confirmé',
        'completed': 'Terminé',
        'cancelled': 'Annulé'
    };
    
    return statuses[status] || status;
}

// Format payment status
function formatPaymentStatus(status) {
    const statuses = {
        'pending': 'En attente',
        'paid': 'Payé'
    };
    
    return statuses[status] || status;
}

// Get category from service name
function getCategoryFromName(name, type) {
    name = name.toLowerCase();
    
    if (type === 'mariage') {
        if (name.includes('menu') || name.includes('adult') || name.includes('enfant')) {
            return 'menu';
        } else if (name.includes('pièce') || name.includes('montée') || name.includes('gâteau')) {
            return 'patisserie';
        } else if (name.includes('déco')) {
            return 'decoration';
        } else if (name.includes('photo') || name.includes('vidéo')) {
            return 'media';
        }
    } else if (type === 'congres') {
        if (name.includes('audio') || name.includes('micro') || name.includes('projecteur')) {
            return 'equipment';
        } else if (name.includes('buffet') || name.includes('café') || name.includes('catering')) {
            return 'catering';
        } else if (name.includes('table') || name.includes('chaise') || name.includes('disposition')) {
            return 'setup';
        } else if (name.includes('accueil') || name.includes('invité') || name.includes('staff')) {
            return 'staff';
        }
    } else if (type === 'khitan') {
        if (name.includes('clown') || name.includes('magicien') || name.includes('spectacle') || name.includes('animation')) {
            return 'animation';
        } else if (name.includes('menu') || name.includes('enfant')) {
            return 'menu';
        } else if (name.includes('déco')) {
            return 'decoration';
        } else if (name.includes('photo') || name.includes('vidéo')) {
            return 'media';
        }
    }
    
    // Default category based on type
    const defaultCategories = {
        'mariage': 'menu',
        'congres': 'equipment',
        'khitan': 'animation'
    };
    
    return defaultCategories[type] || 'other';
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
