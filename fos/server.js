import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use a strong secret in production

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodhub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting to prevent brute force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to authentication routes
app.use('/api/auth', apiLimiter);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ error: 'Authentication required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.status(200).json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Authentication Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, 'user']
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, email, role: 'user', name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        name,
        email,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// User Routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(users[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'An error occurred while fetching profile' });
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    await pool.execute(
      'UPDATE users SET name = ?, phone = ? WHERE id = ?',
      [name, phone, req.user.id]
    );
    
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'An error occurred while updating profile' });
  }
});

// Menu Routes
app.get('/api/menu', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      JOIN categories c ON p.category_id = c.id
    `;
    
    const queryParams = [];
    
    if (category) {
      query += ' WHERE c.name = ?';
      queryParams.push(category);
    }
    
    const [products] = await pool.execute(query, queryParams);
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Menu fetch error:', error);
    res.status(500).json({ error: 'An error occurred while fetching menu items' });
  }
});

app.get('/api/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [products] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json(products[0]);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the product' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await pool.execute('SELECT * FROM categories');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ error: 'An error occurred while fetching categories' });
  }
});

// Order Routes
app.post('/api/orders', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { items, total, address, phone, payment_method, notes } = req.body;
    
    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0 || !total || !address || !phone || !payment_method) {
      return res.status(400).json({ error: 'Invalid order data' });
    }
    
    // Generate order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    
    // Insert order
    await connection.execute(
      'INSERT INTO orders (id, user_id, total, status, address, phone, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [orderId, req.user.id, total, 'preparing', address, phone, payment_method, notes || null]
    );
    
    // Insert order items
    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );
    }
    
    await connection.commit();
    
    res.status(201).json({
      message: 'Order placed successfully',
      orderId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'An error occurred while placing the order' });
  } finally {
    connection.release();
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.*, 
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.id,
            'product_id', oi.product_id,
            'name', p.name,
            'price', oi.price,
            'quantity', oi.quantity
          )
        ) FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = o.id) as items
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    
    // Parse the JSON string for items
    const processedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items || '[]')
    }));
    
    res.status(200).json(processedOrders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'An error occurred while fetching orders' });
  }
});

app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [orders] = await pool.execute(
      `SELECT o.* FROM orders o
       WHERE o.id = ? AND o.user_id = ?`,
      [id, req.user.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Get order items
    const [items] = await pool.execute(
      `SELECT oi.*, p.name, p.image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );
    
    order.items = items;
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the order' });
  }
});

// Admin Routes
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { status } = req.query;
    
    let query = `
      SELECT o.*, u.name as customer_name, u.email as customer_email,
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', oi.id,
            'product_id', oi.product_id,
            'name', p.name,
            'price', oi.price,
            'quantity', oi.quantity
          )
        ) FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = o.id) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;
    
    const queryParams = [];
    
    if (status) {
      query += ' WHERE o.status = ?';
      queryParams.push(status);
    }
    
    query += ' ORDER BY o.created_at DESC';
    
    const [orders] = await pool.execute(query, queryParams);
    
    // Parse the JSON string for items
    const processedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items || '[]')
    }));
    
    res.status(200).json(processedOrders);
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    res.status(500).json({ error: 'An error occurred while fetching orders' });
  }
});

app.put('/api/admin/orders/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['preparing', 'delivering', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    
    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({ error: 'An error occurred while updating the order' });
  }
});

app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const [users] = await pool.execute(
      'SELECT id, name, email, phone, role, created_at FROM users'
    );
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

// Admin Product Management
app.post('/api/admin/products', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { name, description, price, image, category_id, is_featured } = req.body;
    
    // Validate input
    if (!name || !price || !category_id) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO products (name, description, price, image, category_id, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, price, image || null, category_id, is_featured || false]
    );
    
    res.status(201).json({
      message: 'Product added successfully',
      productId: result.insertId
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'An error occurred while adding the product' });
  }
});

app.put('/api/admin/products/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { id } = req.params;
    const { name, description, price, image, category_id, is_featured } = req.body;
    
    // Validate input
    if (!name || !price || !category_id) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    
    await pool.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ?, category_id = ?, is_featured = ? WHERE id = ?',
      [name, description || null, price, image || null, category_id, is_featured || false, id]
    );
    
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ error: 'An error occurred while updating the product' });
  }
});

app.delete('/api/admin/products/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { id } = req.params;
    
    // Check if product is used in any orders
    const [orderItems] = await pool.execute(
      'SELECT * FROM order_items WHERE product_id = ? LIMIT 1',
      [id]
    );
    
    if (orderItems.length > 0) {
      return res.status(409).json({ 
        error: 'Cannot delete product as it is associated with orders',
        suggestion: 'Consider updating the product instead of deleting it'
      });
    }
    
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ error: 'An error occurred while deleting the product' });
  }
});

// Error handling for non-existent routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

export default app;
