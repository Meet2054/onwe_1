// const express = require('express');
// const bodyParser = require('body-parser');
// const postsRoutes = require('../onwe/Routes/Post_route'); // Adjust path as per your project structure

// const app = express();
// app.use(bodyParser.json());

// // Register posts routes
// app.use('/api', postsRoutes); // Example: /api/posts, /api/posts/:postId

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Internal Server Error' });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
const { sequelize, testConnection } = require('./Config/database');

// Import models
const Admins = require('./models/Admins');
const Clubs = require('./models/Clubs');
const Comments = require('./models/Comments');
const Event = require('./models/Event');
const Magazines = require('./models/Magazines');
const Posts = require('./models/Posts');
const Users = require('./models/Users');

// Define associations
Comments.belongsTo(Posts, { foreignKey: 'postId' });
Comments.belongsTo(Users, { foreignKey: 'userId' });
Clubs.belongsTo(Users, { foreignKey: 'admin' });
Magazines.belongsTo(Admins, { foreignKey: 'owner' });
Posts.belongsTo(Users, { foreignKey: 'authorId' });

// Test database connection and sync models
const initializeDatabase = async () => {
  try {
    await testConnection();
    console.log('Connection to the database has been established successfully.');

    await sequelize.sync({ force: true }); // force: true will drop tables if they exist, use it carefully
    console.log('Database and tables have been synced successfully.');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
};

initializeDatabase();
