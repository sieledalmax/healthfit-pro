const express = require('express');
const router = express.Router();
const productsData = require('../data/products.json');

// Get all products with filtering
router.get('/', (req, res) => {
    try {
        const { category, sort, search, bestseller, featured } = req.query;
        
        let filteredProducts = [...productsData];
        
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
        
        // Filter by featured
        if (featured === 'true') {
            filteredProducts = filteredProducts.filter(
                product => product.isFeatured
            );
        }
        
        // Search by name or description
        if (search) {
            const searchTerm = search.toLowerCase();
            filteredProducts = filteredProducts.filter(
                product => 
                    product.name.toLowerCase().includes(searchTerm) || 
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
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
                case 'name':
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                // 'featured' is the default order
            }
        }
        
        res.json({
            success: true,
            count: filteredProducts.length,
            products: filteredProducts
        });
        
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch products' 
        });
    }
});

// Get best sellers
router.get('/bestsellers', (req, res) => {
    try {
        const bestSellers = productsData.filter(product => product.isBestSeller);
        
        res.json({
            success: true,
            count: bestSellers.length,
            products: bestSellers
        });
        
    } catch (error) {
        console.error('Error fetching bestsellers:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch bestsellers' 
        });
    }
});

// Get featured products
router.get('/featured', (req, res) => {
    try {
        const featuredProducts = productsData.filter(product => product.isFeatured);
        
        res.json({
            success: true,
            count: featuredProducts.length,
            products: featuredProducts
        });
        
    } catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch featured products' 
        });
    }
});

// Get product by ID
router.get('/:id', (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = productsData.find(p => p.id === productId);
        
        if (!product) {
            return res.status(404).json({ 
                success: false,
                error: 'Product not found' 
            });
        }
        
        res.json({
            success: true,
            product: product
        });
        
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch product' 
        });
    }
});

// Get products by category
router.get('/category/:category', (req, res) => {
    try {
        const category = req.params.category;
        const categoryProducts = productsData.filter(
            product => product.category === category
        );
        
        res.json({
            success: true,
            category: category,
            count: categoryProducts.length,
            products: categoryProducts
        });
        
    } catch (error) {
        console.error('Error fetching category products:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch category products' 
        });
    }
});

module.exports = router;