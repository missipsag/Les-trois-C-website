const User = require('./models/UserModels');
const  Room  = require('./models/RoomModel');
const  Reservation  = require('./models/ReservationModel');
const Review = require('./models/ReviewModel');
const sequelize = require('./config/db');

(async () => {
    try {
        // Sync database
        await sequelize.sync({ force: true });
        console.log('Database synchronized.');

        // Seed Users
        const users = await User.bulkCreate([
            { userId: '1', firstName: 'Marie', lastName: 'Dubois', email: 'marie.dubois@email.com', NID: '123456789', phone: '1234567890', role: 'user' },
            { userId: '2', firstName: 'Jean', lastName: 'Martin', email: 'jean.martin@email.com', NID: '987654321', phone: '0987654321', role: 'user' },
        ]);
        console.log('Users seeded:', users.length);

        // Seed Rooms
        const rooms = await Room.bulkCreate([
            { roomId: '1', roomName: 'Salle Principale', capacity: 150, type: 'wedding' },
            { roomId: '2', roomName: 'Salle de Conférence', capacity: 80, type: 'conference' },
        ]);
        console.log('Rooms seeded:', rooms.length);

        // Seed Reservations
        const reservations = await Reservation.bulkCreate([
            { reservationId: '1', roomId: '1', userId: '1', reservationDate: '2025-06-15' },
            { reservationId: '2', roomId: '2', userId: '2', reservationDate: '2025-06-22' },
        ]);
        console.log('Reservations seeded:', reservations.length);

        // Seed Reviews
        const reviews = await Review.bulkCreate([
            { reviewId: '1', roomId: '1', userId: '1', rating: 5, content: 'Excellent service, highly recommend!' },
            { reviewId: '2', roomId: '2', userId: '2', rating: 4, content: 'Great experience, but room could be improved.' },
        ]);
        console.log('Reviews seeded:', reviews.length);

        console.log('Database seeding completed.');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await sequelize.close();
    }
})();
