require('@babel/register')({
  extensions: ['.js', '.jsx']
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const port = process.env.PORT || 5001;

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(express.json());

const db = process.env.MONGO_URI;
if (!db) {
  console.error('MONGO_URI environment variable is not defined');
  process.exit(1);
}

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

AdminBro.registerAdapter(AdminBroMongoose);

const CustomDashboard = require('./views/custom-dashboard').default;
const CustomPage = require('./views/custom-page').default;
const CustomLogin = require('./views/custom-login').default;

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
  dashboard: {
    component: AdminBro.bundle('./views/custom-dashboard.jsx')
  },
  pages: {
    customPage: {
      component: AdminBro.bundle('./views/custom-page.jsx'),
      handler: async (request, response, context) => {
        return {
          text: 'I am fetched from the backend',
        };
      },
    },
  },
  branding: {
    companyName: 'Rank and Seats',
    logo: '/static/logo.png',
    softwareBrothers: false,
  },
  loginPage: AdminBro.bundle('./views/custom-login.jsx')
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@rankandseats.com',
  password: process.env.ADMIN_PASSWORD || '100200@admin',
};

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN;
    }
    return null;
  },
  cookieName: 'adminbro',
  cookiePassword: 'somepassword',
}, null, {
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 },
});

app.use(adminBro.options.rootPath, router);

app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);

app.get('/api/courses', (req, res) => {
  Result.find({}, 'course', (err, courses) => {
    if (err) {
      return res.status(500).send('Error fetching courses');
    }
    res.json(courses);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
