const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Beauty Salon API',
    description: 'API for Beauty Salon Management',
  },
  host: 'localhost:5000',
  schemes: ['http'], 
  tags: [
    { name: 'customers', description: 'API for managing customers' },
    { name: 'categories', description: 'API for managing categories' },
    { name: 'services', description: 'API for managing services' },
    { name: 'blogs', description: 'API for managing blogs' },
    { name: 'about', description: 'API for managing about' },
    { name: 'gallery', description: 'API for managing gallery' },
    { name: 'employees', description: 'API for managing employees' },
    { name: 'branches', description: 'API for managing branches' },
    { name: 'auth', description: 'API for managing auth' },
    { name: 'appointments', description: 'API for managing appointments' },
  ],
};

const outputFile = './swagger-output.json';
const routes = [
    './routes/customers.js',
    './routes/categories.js',
    './routes/services.js',
    './routes/blogs.js',
    './routes/about.js',
    './routes/gallery.js',
    './routes/employees.js',
    './routes/branches.js',
    './routes/auth.js',
    './routes/appointments.js',
];

swaggerAutogen(outputFile, routes, doc);