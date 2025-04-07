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

// Setup event listeners
function setupEventListeners() {
  // Get form elements
  const eventType = document.getElementById('eventType');
  const eventTypeCards = document.querySelectorAll('.event-type-card');
  const room = document.getElementById('room');
  const guestCount = document.getElementById('guestCount');
  const paymentOption = document.getElementById('paymentOption');
  const paymentMethod = document.getElementById('paymentMethod');
  const bookingForm = document.getElementById('bookingForm');
  
  // Add event listeners to form elements
  eventType.addEventListener('change', onEventTypeChange);
  
  // Add event listeners to event type cards
  eventTypeCards.forEach(card => {
    card.addEventListener('click', function() {
      // Remove selected class from all cards
      eventTypeCards.forEach(c => c.classList.remove('selected'));
      
      // Add selected class to clicked card
      card.classList.add('selected');
      
      // Update hidden select element
      const value = card.getAttribute('data-value');
      eventType.value = value;
      
      // Trigger change event
      const event = new Event('change');
      eventType.dispatchEvent(event);
    });
  });
  
  room.addEventListener('change', updatePrice);
  guestCount.addEventListener('input', updatePrice);
  paymentOption.addEventListener('change', updatePrice);
  paymentMethod.addEventListener('change', updatePrice);
  bookingForm.addEventListener('submit', handleBookingSubmit);
  
  // Confirmation modal buttons
  document.getElementById('confirmBooking').addEventListener('click', confirmBooking);
  document.getElementById('cancelBooking').addEventListener('click', closeConfirmationModal);
  
  // General UI elements
  document.getElementById('navToggle').addEventListener('click', toggleMobileMenu);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  
  // Modal close buttons
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });
  document.getElementById('modalClose').addEventListener('click', closeMessageModal);
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
  
  // Ajout des images pour chaque salle
  const roomImages = {
    'room1': 'attached_assets/OIP (1).jpeg',
    'room2': 'attached_assets/OIP (2).jpeg',
    'room3': 'attached_assets/OIP (3).jpeg'
  };
  
  // Ajout des descriptions pour chaque salle
  const roomDescriptions = {
    'room1': 'Grande Salle de Réception - Parfaite pour les grands mariages',
    'room2': 'Salle de Conférence - Idéale pour les événements professionnels',
    'room3': 'Salle de Célébration Khitan - Espace convivial pour les cérémonies traditionnelles'
  };
  
  rooms.filter(r => r.available).forEach(r => {
    const option = document.createElement('option');
    option.value = r.id;
    option.textContent = `${r.name} (Capacité: ${r.capacity} personnes - ${r.price} DZD)`;
    option.dataset.image = roomImages[r.id] || '';
    option.dataset.description = roomDescriptions[r.id] || '';
    room.appendChild(option);
  });
  
  // Ajouter un gestionnaire d'événements pour afficher l'image lorsqu'une salle est sélectionnée
  room.addEventListener('change', function() {
    const selectedOption = room.options[room.selectedIndex];
    const roomImageContainer = document.getElementById('roomImageContainer');
    const roomImage = document.getElementById('roomImage');
    const roomDescription = document.getElementById('roomDescription');
    
    if (room.value && selectedOption.dataset.image) {
      roomImage.src = selectedOption.dataset.image;
      roomDescription.textContent = selectedOption.dataset.description;
      roomImageContainer.style.display = 'block';
    } else {
      roomImageContainer.style.display = 'none';
    }
  });
}

// Handle event type change
function onEventTypeChange() {
  const type = document.getElementById('eventType').value;
  
  if (type) {
    renderServiceOptions(type);
  } else {
    document.getElementById('serviceOptions').innerHTML = '';
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
  const serviceOptions = document.getElementById('serviceOptions');
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
  
  // Service info (name and price)
  const serviceInfo = document.createElement('div');
  serviceInfo.className = 'service-info';
  
  const serviceName = document.createElement('div');
  serviceName.className = 'service-name';
  serviceName.textContent = service.name;
  
  const servicePrice = document.createElement('div');
  servicePrice.className = 'service-price';
  servicePrice.textContent = `${service.price} DZD`;
  
  serviceInfo.appendChild(serviceName);
  serviceInfo.appendChild(servicePrice);
  
  // Quantity controls
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
  
  // Add to service item
  const serviceControls = document.createElement('div');
  serviceControls.className = 'service-controls';
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
  const room = document.getElementById('room');
  const guestCount = document.getElementById('guestCount');
  const totalPrice = document.getElementById('totalPrice');
  const priceDetails = document.getElementById('priceDetails');
  
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
    addPriceDetail(name, `${detail.quantity} × ${detail.price} DZD`, detail.price * detail.quantity);
  });
  
  // Update total price display
  totalPrice.textContent = total.toLocaleString('fr-FR');
}

// Add price detail row
function addPriceDetail(name, description, price) {
  const priceDetails = document.getElementById('priceDetails');
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
  detailPrice.textContent = `${price.toLocaleString('fr-FR')} DZD`;
  
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
  document.getElementById('confirmationModal').style.display = 'block';
}

// Validate booking form
function validateForm() {
  const eventType = document.getElementById('eventType');
  const eventDate = document.getElementById('eventDate');
  const room = document.getElementById('room');
  const guestCount = document.getElementById('guestCount');
  
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
  const eventType = document.getElementById('eventType');
  const eventDate = document.getElementById('eventDate');
  const room = document.getElementById('room');
  const guestCount = document.getElementById('guestCount');
  const paymentOption = document.getElementById('paymentOption');
  const paymentMethod = document.getElementById('paymentMethod');
  const bookingSummary = document.getElementById('bookingSummary');
  
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
      <div class="summary-row"><span>Prix total:</span> <span>${currentTotal.toLocaleString('fr-FR')} DZD</span></div>
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
      summaryHTML += `<li>${name}: ${detail.quantity} × ${detail.price} DZD = ${(detail.price * detail.quantity).toLocaleString('fr-FR')} DZD</li>`;
    });
    
    summaryHTML += `</ul></div>`;
  }
  
  summaryHTML += `</div>`;
  
  // Update booking summary
  bookingSummary.innerHTML = summaryHTML;
}

// Confirm booking
function confirmBooking() {
  const eventType = document.getElementById('eventType');
  const eventDate = document.getElementById('eventDate');
  const room = document.getElementById('room');
  const guestCount = document.getElementById('guestCount');
  const paymentOption = document.getElementById('paymentOption');
  const paymentMethod = document.getElementById('paymentMethod');
  
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
  const bookingForm = document.getElementById('bookingForm');
  const serviceOptions = document.getElementById('serviceOptions');
  const priceDetails = document.getElementById('priceDetails');
  const totalPrice = document.getElementById('totalPrice');
  
  bookingForm.reset();
  selectedServices = [];
  serviceOptions.innerHTML = '';
  priceDetails.innerHTML = '';
  totalPrice.textContent = '0';
}

// Close confirmation modal
function closeConfirmationModal() {
  document.getElementById('confirmationModal').style.display = 'none';
}

// Close all modals
function closeAllModals() {
  document.getElementById('confirmationModal').style.display = 'none';
  document.getElementById('messageModal').style.display = 'none';
}

// Close message modal
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
// Group array by property
function groupBy(array, key) {
  return array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
}

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

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);