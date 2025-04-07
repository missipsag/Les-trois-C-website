// Constants
const ROLES = { CLIENT: 'client', ADMIN: 'admin' };

// Demo data setup
const defaultRooms = [
  { id: 'room1', name: 'Grande Salle', capacity: 500, price: 3000, available: true },
  { id: 'room2', name: 'Salle Moyenne', capacity: 250, price: 1800, available: true },
  { id: 'room3', name: 'Petite Salle', capacity: 100, price: 800, available: true }
];

// Demo services by event type
const defaultServices = {
  mariage: [
    { id: 'svc1', name: 'Menu Adultes Premium', price: 45, category: 'menu', available: true },
    { id: 'svc2', name: 'Menu Enfants', price: 20, category: 'menu', available: true },
    { id: 'svc3', name: 'Pièce montée', price: 350, category: 'patisserie', available: true },
    { id: 'svc4', name: 'Décoration personnalisée', price: 500, category: 'decoration', available: true },
    { id: 'svc5', name: 'Service photo/vidéo', price: 800, category: 'media', available: true }
  ],
  congres: [
    { id: 'svc6', name: 'Équipement audiovisuel complet', price: 400, category: 'equipment', available: true },
    { id: 'svc7', name: 'Projecteur HD', price: 100, category: 'equipment', available: true },
    { id: 'svc8', name: 'Buffet complet', price: 30, category: 'catering', available: true },
    { id: 'svc9', name: 'Pause-café', price: 12, category: 'catering', available: true }
  ],
  khitan: [
    { id: 'svc10', name: 'Animation clown', price: 250, category: 'animation', available: true },
    { id: 'svc11', name: 'Menu spécial enfants', price: 18, category: 'menu', available: true },
    { id: 'svc12', name: 'Décoration personnalisée', price: 350, category: 'decoration', available: true },
    { id: 'svc13', name: 'Service photo/vidéo', price: 600, category: 'media', available: true }
  ]
};

// Functions
function initializeStorage() {
  if (!localStorage.getItem('users')) {
    const admin = { 
      id: 'admin1', name: 'Admin', email: 'admin@salledesfetes.com', 
      phone: '0123456789', password: btoa('admin123'), role: ROLES.ADMIN 
    };
    localStorage.setItem('users', JSON.stringify([admin]));
  }
  
  if (!localStorage.getItem('rooms')) {
    localStorage.setItem('rooms', JSON.stringify(defaultRooms));
  }
  
  if (!localStorage.getItem('services')) {
    // Create a flat array of services with type property
    const services = [
      ...defaultServices.mariage.map(s => ({...s, type: 'mariage'})),
      ...defaultServices.congres.map(s => ({...s, type: 'congres'})),
      ...defaultServices.khitan.map(s => ({...s, type: 'khitan'}))
    ];
    localStorage.setItem('services', JSON.stringify(services));
  }
  
  if (!localStorage.getItem('bookings')) {
    localStorage.setItem('bookings', JSON.stringify([]));
  }
}

function init() {
  initializeStorage();
  setupEventListeners();
  updateNavigation();
}

function setupEventListeners() {
  // Get elements
  const elements = {
    loginTab: document.getElementById('loginTab'),
    registerTab: document.getElementById('registerTab'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    navToggle: document.getElementById('navToggle'),
    logoutBtn: document.getElementById('logoutBtn'),
    modalClose: document.getElementById('modalClose'),
    closeModal: document.querySelector('.close-modal')
  };
  
  // Set up event listeners
  if (elements.loginTab) elements.loginTab.addEventListener('click', () => switchTab('login'));
  if (elements.registerTab) elements.registerTab.addEventListener('click', () => switchTab('register'));
  if (elements.loginForm) elements.loginForm.addEventListener('submit', handleLogin);
  if (elements.registerForm) elements.registerForm.addEventListener('submit', handleRegister);
  if (elements.navToggle) elements.navToggle.addEventListener('click', toggleMenu);
  if (elements.logoutBtn) elements.logoutBtn.addEventListener('click', handleLogout);
  if (elements.modalClose) elements.modalClose.addEventListener('click', hideMessage);
  if (elements.closeModal) elements.closeModal.addEventListener('click', hideMessage);
}

function updateNavigation() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const bookingLink = document.getElementById('bookingLink');
  const adminLink = document.getElementById('adminLink');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (!bookingLink || !adminLink || !logoutBtn) return;
  
  if (user) {
    bookingLink.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    adminLink.classList[user.role === ROLES.ADMIN ? 'remove' : 'add']('hidden');
  } else {
    bookingLink.classList.add('hidden');
    adminLink.classList.add('hidden');
    logoutBtn.classList.add('hidden');
  }
}

function switchTab(tab) {
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (tab === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email);
  
  if (!user || btoa(password) !== user.password) {
    showMessage('Email ou mot de passe incorrect.');
    return;
  }
  
  const userData = {
    id: user.id, name: user.name, email: user.email,
    phone: user.phone, role: user.role
  };
  
  localStorage.setItem('currentUser', JSON.stringify(userData));
  window.location.href = user.role === ROLES.ADMIN ? 'admin.html' : 'booking.html';
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phone = document.getElementById('registerPhone').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirm = document.getElementById('registerConfirmPassword').value;
  
  if (password !== confirm) {
    showMessage('Les mots de passe ne correspondent pas.');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.some(u => u.email === email)) {
    showMessage('Cet email est déjà utilisé.');
    return;
  }
  
  const id = 'user' + Date.now().toString().substring(7);
  const newUser = {
    id, name, email, phone, password: btoa(password),
    role: ROLES.CLIENT, createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  const userData = {id, name, email, phone, role: ROLES.CLIENT};
  localStorage.setItem('currentUser', JSON.stringify(userData));
  window.location.href = 'booking.html';
}

function handleLogout(e) {
  e.preventDefault();
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

function showMessage(message) {
  document.getElementById('modalMessage').textContent = message;
  document.getElementById('messageModal').style.display = 'block';
}

function hideMessage() {
  document.getElementById('messageModal').style.display = 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
