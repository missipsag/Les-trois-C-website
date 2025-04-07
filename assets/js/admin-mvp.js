// Global variables
let currentUser = null;
let bookings = [];
let rooms = [];
let services = [];
let users = [];
let currentServiceType = 'mariage';

// Initialize the app
function init() {
  checkAuthentication();
  loadData();
  setupEventListeners();
}

// Check authentication
function checkAuthentication() {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }
  
  if (currentUser.role !== 'admin') {
    window.location.href = 'booking.html';
  }
}

// Setup event listeners
function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll('.admin-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
  
  // Service type selection
  document.querySelectorAll('.service-types .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchServiceType(btn.dataset.service));
  });
  
  // Add/edit buttons
  document.getElementById('addRoomBtn').addEventListener('click', showAddRoomModal);
  document.getElementById('addServiceBtn').addEventListener('click', showAddServiceModal);
  
  // Form submissions
  document.getElementById('roomForm').addEventListener('submit', handleRoomFormSubmit);
  document.getElementById('serviceForm').addEventListener('submit', handleServiceFormSubmit);
  
  // Cancel buttons
  document.getElementById('cancelRoomBtn').addEventListener('click', closeRoomModal);
  document.getElementById('cancelServiceBtn').addEventListener('click', closeServiceModal);
  document.getElementById('closeBookingDetailBtn').addEventListener('click', closeBookingDetailModal);
  
  // Update booking status
  document.getElementById('updateBookingBtn').addEventListener('click', updateBookingStatus);
  
  // Filter buttons for bookings
  document.getElementById('applyFilters').addEventListener('click', handleFilterBookings);
  document.getElementById('resetFilters').addEventListener('click', resetBookingFilters);
  
  // Close modals
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });
  
  // Modal close buttons
  document.getElementById('modalClose').addEventListener('click', closeMessageModal);
  
  // Mobile menu
  document.getElementById('navToggle').addEventListener('click', toggleMobileMenu);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// Load data from localStorage
function loadData() {
  bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  rooms = JSON.parse(localStorage.getItem('rooms')) || [];
  services = JSON.parse(localStorage.getItem('services')) || [];
  users = JSON.parse(localStorage.getItem('users')) || [];
  
  renderTables();
}

// Render all tables
function renderTables() {
  renderBookingsTable();
  renderRoomsTable();
  renderServicesTable(currentServiceType);
  renderUsersTable();
}

// Render bookings table
function renderBookingsTable(filter = {}) {
  const tbody = document.querySelector('#bookingsTable tbody');
  tbody.innerHTML = '';
  
  // Update booking counters
  updateBookingCounters();
  
  // Apply filters
  let filteredBookings = [...bookings];
  
  if (filter.status && filter.status !== 'all') {
    filteredBookings = filteredBookings.filter(b => b.status === filter.status);
  }
  
  if (filter.date) {
    filteredBookings = filteredBookings.filter(b => b.date === filter.date);
  }
  
  if (filter.userId) {
    filteredBookings = filteredBookings.filter(b => b.userId === filter.userId);
  }
  
  // Sort by created date (newest first)
  filteredBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  filteredBookings.forEach(booking => {
    const user = users.find(u => u.id === booking.userId) || { name: 'Inconnu' };
    const room = rooms.find(r => r.id === booking.roomId) || { name: 'Inconnue' };
    
    const tr = document.createElement('tr');
    
    // Format date
    const formattedDate = new Date(booking.date).toLocaleDateString('fr-FR');
    
    tr.innerHTML = `
      <td>${booking.id.substring(0, 6)}</td>
      <td>${user.name}</td>
      <td>${formatEventType(booking.type)}</td>
      <td>${formattedDate}</td>
      <td>${room.name}</td>
      <td>${booking.payment.total}€</td>
      <td><span class="status-badge ${booking.status}">${formatStatus(booking.status)}</span></td>
      <td>
        <button class="btn btn-small" data-id="${booking.id}">Détails</button>
      </td>
    `;
    
    // Add event listener for view details button
    tr.querySelector('button').addEventListener('click', () => showBookingDetails(booking.id));
    
    tbody.appendChild(tr);
  });
}

// Render rooms table
function renderRoomsTable() {
  const tbody = document.querySelector('#roomsTable tbody');
  tbody.innerHTML = '';
  
  rooms.forEach(room => {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td>${room.name}</td>
      <td>${room.capacity} personnes</td>
      <td>${room.price}€</td>
      <td>${room.available ? 'Disponible' : 'Indisponible'}</td>
      <td>
        <button class="btn btn-small" data-action="edit" data-id="${room.id}">Modifier</button>
        <button class="btn btn-small ${room.available ? 'btn-warning' : 'btn-success'}" data-action="toggle" data-id="${room.id}">
          ${room.available ? 'Désactiver' : 'Activer'}
        </button>
      </td>
    `;
    
    // Add event listeners for buttons
    tr.querySelector('button[data-action="edit"]').addEventListener('click', () => showEditRoomModal(room.id));
    tr.querySelector('button[data-action="toggle"]').addEventListener('click', () => toggleRoomAvailability(room.id));
    
    tbody.appendChild(tr);
  });
}

// Render services table
function renderServicesTable(eventType) {
  const tbody = document.querySelector('#servicesTable tbody');
  tbody.innerHTML = '';
  
  const filteredServices = services.filter(s => s.type === eventType);
  
  filteredServices.forEach(service => {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td>${service.name}</td>
      <td>${service.price}€</td>
      <td>${service.available ? 'Disponible' : 'Indisponible'}</td>
      <td>
        <button class="btn btn-small" data-action="edit" data-id="${service.id}">Modifier</button>
        <button class="btn btn-small ${service.available ? 'btn-warning' : 'btn-success'}" data-action="toggle" data-id="${service.id}">
          ${service.available ? 'Désactiver' : 'Activer'}
        </button>
      </td>
    `;
    
    // Add event listeners for buttons
    tr.querySelector('button[data-action="edit"]').addEventListener('click', () => showEditServiceModal(service.id));
    tr.querySelector('button[data-action="toggle"]').addEventListener('click', () => toggleServiceAvailability(service.id));
    
    tbody.appendChild(tr);
  });
}

// Render users table
function renderUsersTable() {
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';
  
  users.filter(user => user.role === 'client').forEach(user => {
    const userBookings = bookings.filter(b => b.userId === user.id);
    
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${userBookings.length}</td>
      <td>
        <button class="btn btn-small" data-action="viewBookings" data-id="${user.id}">Voir réservations</button>
      </td>
    `;
    
    // Add event listener for view bookings button
    tr.querySelector('button[data-action="viewBookings"]').addEventListener('click', () => filterBookingsByUser(user.id));
    
    tbody.appendChild(tr);
  });
}

// Switch tab
function switchTab(tabId) {
  // Update active tab button
  document.querySelectorAll('.admin-tabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  
  // Update active tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `${tabId}Tab`);
  });
}

// Switch service type
function switchServiceType(type) {
  currentServiceType = type;
  
  // Update active service type button
  document.querySelectorAll('.service-types .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.service === type);
  });
  
  // Re-render services table
  renderServicesTable(type);
}

// Show add room modal
function showAddRoomModal() {
  const roomModalTitle = document.getElementById('roomModalTitle');
  const roomId = document.getElementById('roomId');
  const roomForm = document.getElementById('roomForm');
  
  roomModalTitle.textContent = 'Ajouter une salle';
  roomId.value = '';
  roomForm.reset();
  
  document.getElementById('roomModal').style.display = 'block';
}

// Show edit room modal
function showEditRoomModal(id) {
  const room = rooms.find(r => r.id === id);
  if (!room) return;
  
  const roomModalTitle = document.getElementById('roomModalTitle');
  const roomId = document.getElementById('roomId');
  const roomName = document.getElementById('roomName');
  const roomCapacity = document.getElementById('roomCapacity');
  const roomPrice = document.getElementById('roomPrice');
  const roomAvailable = document.getElementById('roomAvailable');
  
  roomModalTitle.textContent = 'Modifier la salle';
  roomId.value = room.id;
  roomName.value = room.name;
  roomCapacity.value = room.capacity;
  roomPrice.value = room.price;
  roomAvailable.value = room.available.toString();
  
  document.getElementById('roomModal').style.display = 'block';
}

// Show add service modal
function showAddServiceModal() {
  const serviceModalTitle = document.getElementById('serviceModalTitle');
  const serviceId = document.getElementById('serviceId');
  const serviceForm = document.getElementById('serviceForm');
  const serviceType = document.getElementById('serviceType');
  
  serviceModalTitle.textContent = 'Ajouter un service';
  serviceId.value = '';
  serviceForm.reset();
  serviceType.value = currentServiceType;
  
  document.getElementById('serviceModal').style.display = 'block';
}

// Show edit service modal
function showEditServiceModal(id) {
  const service = services.find(s => s.id === id);
  if (!service) return;
  
  const serviceModalTitle = document.getElementById('serviceModalTitle');
  const serviceId = document.getElementById('serviceId');
  const serviceName = document.getElementById('serviceName');
  const serviceType = document.getElementById('serviceType');
  const servicePrice = document.getElementById('servicePrice');
  const serviceAvailable = document.getElementById('serviceAvailable');
  
  serviceModalTitle.textContent = 'Modifier le service';
  serviceId.value = service.id;
  serviceName.value = service.name;
  serviceType.value = service.type;
  servicePrice.value = service.price;
  serviceAvailable.value = service.available.toString();
  
  document.getElementById('serviceModal').style.display = 'block';
}

// Handle room form submit
function handleRoomFormSubmit(e) {
  e.preventDefault();
  
  const roomId = document.getElementById('roomId').value;
  const name = document.getElementById('roomName').value.trim();
  const capacity = parseInt(document.getElementById('roomCapacity').value);
  const price = parseFloat(document.getElementById('roomPrice').value);
  const available = document.getElementById('roomAvailable').value === 'true';
  
  if (name === '' || capacity <= 0 || price <= 0) {
    showMessage('Veuillez remplir tous les champs correctement.');
    return;
  }
  
  if (roomId) {
    // Update existing room
    const roomIndex = rooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      rooms[roomIndex] = { ...rooms[roomIndex], name, capacity, price, available };
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
  }
  
  // Save to localStorage
  localStorage.setItem('rooms', JSON.stringify(rooms));
  
  // Close modal and refresh table
  closeRoomModal();
  renderRoomsTable();
  
  showMessage(roomId ? 'Salle modifiée avec succès.' : 'Salle ajoutée avec succès.');
}

// Handle service form submit
function handleServiceFormSubmit(e) {
  e.preventDefault();
  
  const serviceId = document.getElementById('serviceId').value;
  const name = document.getElementById('serviceName').value.trim();
  const type = document.getElementById('serviceType').value;
  const price = parseFloat(document.getElementById('servicePrice').value);
  const available = document.getElementById('serviceAvailable').value === 'true';
  
  if (name === '' || !type || price <= 0) {
    showMessage('Veuillez remplir tous les champs correctement.');
    return;
  }
  
  if (serviceId) {
    // Update existing service
    const serviceIndex = services.findIndex(s => s.id === serviceId);
    if (serviceIndex !== -1) {
      services[serviceIndex] = { 
        ...services[serviceIndex], 
        name, 
        type, 
        price, 
        available 
      };
    }
  } else {
    // Add new service
    const newService = {
      id: generateId(),
      name,
      type,
      category: getCategoryFromName(name, type),
      price,
      available
    };
    
    services.push(newService);
  }
  
  // Save to localStorage
  localStorage.setItem('services', JSON.stringify(services));
  
  // Close modal and refresh table
  closeServiceModal();
  renderServicesTable(currentServiceType);
  
  showMessage(serviceId ? 'Service modifié avec succès.' : 'Service ajouté avec succès.');
}

// Toggle room availability
function toggleRoomAvailability(id) {
  const roomIndex = rooms.findIndex(r => r.id === id);
  if (roomIndex !== -1) {
    rooms[roomIndex].available = !rooms[roomIndex].available;
    
    // Save to localStorage
    localStorage.setItem('rooms', JSON.stringify(rooms));
    
    // Refresh table
    renderRoomsTable();
  }
}

// Toggle service availability
function toggleServiceAvailability(id) {
  const serviceIndex = services.findIndex(s => s.id === id);
  if (serviceIndex !== -1) {
    services[serviceIndex].available = !services[serviceIndex].available;
    
    // Save to localStorage
    localStorage.setItem('services', JSON.stringify(services));
    
    // Refresh table
    renderServicesTable(currentServiceType);
  }
}

// Show booking details
function showBookingDetails(id) {
  const booking = bookings.find(b => b.id === id);
  if (!booking) return;
  
  const user = users.find(u => u.id === booking.userId) || { name: 'Inconnu' };
  const room = rooms.find(r => r.id === booking.roomId) || { name: 'Inconnue' };
  
  // Format date
  const formattedDate = new Date(booking.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Generate HTML content
  let html = `
    <div class="booking-details">
      <div class="detail-row"><strong>ID:</strong> ${booking.id}</div>
      <div class="detail-row"><strong>Client:</strong> ${user.name} (${user.email})</div>
      <div class="detail-row"><strong>Type d'événement:</strong> ${formatEventType(booking.type)}</div>
      <div class="detail-row"><strong>Date:</strong> ${formattedDate}</div>
      <div class="detail-row"><strong>Salle:</strong> ${room.name}</div>
      <div class="detail-row"><strong>Invités:</strong> ${booking.guestCount} personnes</div>
      <div class="detail-row"><strong>Prix total:</strong> ${booking.payment.total}€</div>
      <div class="detail-row"><strong>Option de paiement:</strong> ${formatPaymentOption(booking.payment.option)}</div>
      <div class="detail-row"><strong>Méthode de paiement:</strong> ${formatPaymentMethod(booking.payment.method)}</div>
      <div class="detail-row"><strong>Statut du paiement:</strong> ${formatPaymentStatus(booking.payment.firstPaymentStatus)}</div>
      <div class="detail-row"><strong>Date de création:</strong> ${new Date(booking.createdAt).toLocaleString('fr-FR')}</div>
    `;
    
  // Add services if any
  if (booking.services && booking.services.length > 0) {
    html += `<div class="booking-services"><h4>Services sélectionnés:</h4><ul>`;
    
    const groupedServices = {};
    booking.services.forEach(service => {
      if (!groupedServices[service.name]) {
        groupedServices[service.name] = { price: service.price, quantity: service.quantity };
      } else {
        groupedServices[service.name].quantity += service.quantity;
      }
    });
    
    Object.entries(groupedServices).forEach(([name, detail]) => {
      html += `<li>${name}: ${detail.quantity} × ${detail.price}€ = ${(detail.price * detail.quantity)}€</li>`;
    });
    
    html += `</ul></div>`;
  }
  
  html += `</div>`;
  
  // Update content and set status value
  document.getElementById('bookingDetailContent').innerHTML = html;
  document.getElementById('bookingStatus').value = booking.status;
  
  // Store booking ID for update
  document.getElementById('bookingDetailModal').dataset.bookingId = booking.id;
  
  // Show modal
  document.getElementById('bookingDetailModal').style.display = 'block';
}

// Update booking status
function updateBookingStatus() {
  const bookingId = document.getElementById('bookingDetailModal').dataset.bookingId;
  const newStatus = document.getElementById('bookingStatus').value;
  
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex !== -1) {
    bookings[bookingIndex].status = newStatus;
    
    // Save to localStorage
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Close modal and refresh table
    closeBookingDetailModal();
    renderBookingsTable();
    
    showMessage('Statut de la réservation mis à jour avec succès.');
  }
}

// Filter bookings by user
function filterBookingsByUser(userId) {
  // Switch to bookings tab
  switchTab('bookings');
  
  // Apply filter
  renderBookingsTable({ userId });
  
  // Show message
  const user = users.find(u => u.id === userId);
  showMessage(`Affichage des réservations de ${user ? user.name : 'l\'utilisateur'}.`);
}

// Handle filter bookings
function handleFilterBookings() {
  const status = document.getElementById('bookingStatusFilter').value;
  const date = document.getElementById('bookingDateFilter').value;
  
  renderBookingsTable({ status, date });
}

// Reset booking filters
function resetBookingFilters() {
  document.getElementById('bookingStatusFilter').value = 'all';
  document.getElementById('bookingDateFilter').value = '';
  
  renderBookingsTable();
}

// Close modals
function closeRoomModal() {
  document.getElementById('roomModal').style.display = 'none';
}

function closeServiceModal() {
  document.getElementById('serviceModal').style.display = 'none';
}

function closeBookingDetailModal() {
  document.getElementById('bookingDetailModal').style.display = 'none';
}

// Update booking counters
function updateBookingCounters() {
  // Count bookings by status
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;
  
  // Update counter elements
  document.getElementById('pendingCount').textContent = pendingCount;
  document.getElementById('confirmedCount').textContent = confirmedCount;
  document.getElementById('completedCount').textContent = completedCount;
  document.getElementById('cancelledCount').textContent = cancelledCount;
}

function closeAllModals() {
  closeRoomModal();
  closeServiceModal();
  closeBookingDetailModal();
  closeMessageModal();
}

function closeMessageModal() {
  document.getElementById('messageModal').style.display = 'none';
}

// Show message
function showMessage(message) {
  document.getElementById('modalMessage').textContent = message;
  document.getElementById('messageModal').style.display = 'block';
}

// Toggle mobile menu
function toggleMobileMenu() {
  document.getElementById('navLinks').classList.toggle('active');
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
  return 'id_' + Date.now().toString().substring(7) + Math.random().toString(36).substring(2, 5);
}

// Format category name
function formatCategoryName(category) {
  const categories = {
    'menu': 'Menus',
    'decoration': 'Décoration',
    'media': 'Photo/Vidéo',
    'patisserie': 'Pâtisserie',
    'animation': 'Animation',
    'equipment': 'Équipement',
    'catering': 'Restauration',
    'staff': 'Personnel',
    'setup': 'Mise en place'
  };
  
  return categories[category] || category;
}

// Get category from name
function getCategoryFromName(name, type) {
  name = name.toLowerCase();
  
  if (name.includes('menu') || name.includes('repas') || name.includes('plat')) {
    return 'menu';
  } else if (name.includes('décoration') || name.includes('deco')) {
    return 'decoration';
  } else if (name.includes('photo') || name.includes('vidéo') || name.includes('video')) {
    return 'media';
  } else if (name.includes('gâteau') || name.includes('gateau') || name.includes('pâtisserie')) {
    return 'patisserie';
  } else if (name.includes('animation') || name.includes('clown') || name.includes('magicien')) {
    return 'animation';
  } else if (name.includes('équipement') || name.includes('projecteur') || name.includes('micro')) {
    return 'equipment';
  } else if (name.includes('pause') || name.includes('café') || name.includes('buffet')) {
    return 'catering';
  } else if (name.includes('personnel') || name.includes('accueil') || name.includes('service')) {
    return 'staff';
  } else if (name.includes('installation') || name.includes('table') || name.includes('chaise')) {
    return 'setup';
  }
  
  // Default categories based on event type
  const defaultCategories = {
    'mariage': 'decoration',
    'congres': 'equipment',
    'khitan': 'animation'
  };
  
  return defaultCategories[type] || 'other';
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
    'paid': 'Payé',
    'due': 'À payer'
  };
  
  return statuses[status] || status;
}

// Format payment option
function formatPaymentOption(option) {
  const options = {
    'full': 'Paiement complet',
    'installments': 'Paiement en tranches (30%-50%-20%)'
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

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);