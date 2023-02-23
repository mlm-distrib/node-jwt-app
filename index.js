const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Secret key for signing JWT token
const secretKey = 'my_secret_key';

// Sample User data for authentication
const users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', password: 'password1' },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', password: 'password2' },
];

// Login route for generating JWT token
app.post('/login', (req, res) => {
  // Get user email and password from request body
  const { email, password } = req.body;

  // Find user by email and password
  const user = users.find((user) => user.email === email && user.password === password);

  if (!user) {
    // If user not found, return error response
    res.status(401).json({ message: 'Invalid email or password' });
  } else {
    // If user found, generate JWT token and return success response
    const token = jwt.sign({ sub: user.id }, secretKey, { expiresIn: '1m' });
    res.json({ token });
  }
});

// Sample protected route that requires JWT token authentication
app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.sub;
      // Find user by id
      const user = users.find((user) => user.id === userId);
      if (user) {
        // If user found, return success response
        res.json({ message: `Hello, ${user.name}! This is a protected route.` });
      } else {
        // If user not found, return error response
        res.status(401).json({ message: 'Invalid token' });
      }
    } catch (err) {
      // If JWT verification fails, return error response
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    // If authorization header not found, return error response
    res.status(401).json({ message: 'Authorization header not found' });
  }
});

// Start server
app.listen(3000, () => console.log('Server started on port 3000'));
