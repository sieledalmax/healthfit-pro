// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample product data (in a real app, this would come from a database)
const products = [
    {
        id: 1,
        name: "Green Tea Fat Burner",
        category: "weight-loss",
        price: 29.99,
        oldPrice: 39.99,
        rating: 4.5,
        sales: 284,
        description: "Advanced formula with natural extracts to boost metabolism and support weight management.",
        image: "https://images.unsplash.com/photo-1594736797933-d0b4ec4d7d72?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        isBestSeller: true,
        isFeatured: true
    },
    // ... more products (same as in the frontend mock data)
];

// API Routes

// Get all products with optional filtering
app.get('/api/products', (req, res) => {
    const { category, sort, search, bestseller } = req.query;
    
    let filteredProducts = [...products];
    
    // Filter by category
    if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(
            product => product.category === category
        );
    }
    
    // Filter by bestseller
    if (bestseller === 'true') {
        filteredProducts = filteredProducts.filter(
            product => product.isBestSeller
        );
    }
    
    // Search by name or description
    if (search) {
        const searchTerm = search.toLowerCase();
        filteredProducts = filteredProducts.filter(
            product => 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort products
    if (sort) {
        switch (sort) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'bestseller':
                filteredProducts.sort((a, b) => b.sales - a.sales);
                break;
            // 'featured' is the default order
        }
    }
    
    res.json(filteredProducts);
});

// Get a single product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
});

// Get best sellers
app.get('/api/products/bestsellers', (req, res) => {
    const bestSellers = products.filter(product => product.isBestSeller);
    res.json(bestSellers);
});

// Add to cart (simplified)
app.post('/api/cart', (req, res) => {
    const { productId, quantity } = req.body;
    
    // In a real app, you would:
    // 1. Validate the product exists
    // 2. Add to user's cart in the database
    // 3. Return updated cart
    
    res.json({ 
        success: true, 
        message: 'Product added to cart',
        productId,
        quantity
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});