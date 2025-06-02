// api.routes.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ValidationError } = require('./errorHandling');
const { authMiddleware, validateProduct } = require('./middleware');

const router = express.Router();

// Sample in-memory products database (can be moved to a data layer later)
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  },
  {
    id: '4',
    name: 'Headphones',
    description: 'Noise-cancelling over-ear headphones',
    price: 150,
    category: 'electronics',
    inStock: true
  },
  {
    id: '5',
    name: 'Blender',
    description: 'High-speed blender for smoothies',
    price: 75,
    category: 'kitchen',
    inStock: true
  }
];

// GET /api/products: List all products with filtering, pagination, and search
router.get('/', (req, res, next) => {
  try {
    let filteredProducts = [...products];

    // Filtering by category
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(p =>
        p.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }

    // Searching by name
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm)
      );
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      totalProducts: filteredProducts.length,
      currentPage: page,
      totalPages: Math.ceil(filteredProducts.length / limit),
      products: paginatedProducts
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id: Get a specific product by ID
router.get('/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found.');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products: Create a new product
router.post('/', authMiddleware, validateProduct, (req, res, next) => {
  try {
    const newProduct = {
      id: uuidv4(),
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      inStock: req.body.inStock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id: Update an existing product
router.put('/:id', authMiddleware, validateProduct, (req, res, next) => {
  try {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      throw new NotFoundError('Product not found.');
    }

    const updatedProduct = {
      id: productId,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      inStock: req.body.inStock
    };

    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id: Delete a product
router.delete('/:id', authMiddleware, (req, res, next) => {
  try {
    const initialLength = products.length;
    products = products.filter(p => p.id !== req.params.id);

    if (products.length === initialLength) {
      throw new NotFoundError('Product not found.');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/products/statistics: Get product statistics
router.get('/statistics', (req, res, next) => {
  try {
    const stats = {};
    products.forEach(p => {
      stats[p.category] = (stats[p.category] || 0) + 1;
    });
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
