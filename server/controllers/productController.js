const Product = require('../models/Product');
const upload = require('./uploadConfig');
const mongoose = require('mongoose');
const fs = require('fs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

exports.addProduct = async (req, res) => {
  try {
    // Extract user ID from JWT token
    const token = req.header('Authorization').split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userId = decoded.user.id;

    // Extract all fields from request body
    const { 
      brand, 
      location, 
      category, 
      title, 
      equipmentType, 
      condition, 
      description, 
      ownerPrice, // Changed from price to ownerPrice
      age,
      toolUsage,
      previousRentals,
      calculatedPrice,
      dateRange 
    } = req.body;

    // Convert uploaded files to Base64 strings
    const photosBase64 = req.files.map(file => {
      const img = fs.readFileSync(file.path);
      return `data:${file.mimetype};base64,${img.toString('base64')}`;
    });

    const [startDate, endDate] = JSON.parse(dateRange);

    // Calculate final price (you might want to validate this against the client-side calculation)
    const basePrice = parseFloat(ownerPrice);
    const ageFactor = Math.max(0.5, 1 - (age * 0.05));
    const usageFactor = Math.max(0.6, 1 - ((toolUsage / 1000) * 0.02));
    const popularityFactor = Math.min(1.2, 1 + (previousRentals * 0.02));
    const finalCalculatedPrice = Math.round((basePrice * ageFactor * usageFactor * popularityFactor));
    const finalPrice = Math.round((basePrice + finalCalculatedPrice) / 2);

    const newProduct = new Product({
      user: userId,
      brand,
      location,
      category,
      title,
      equipmentType,
      condition,
      description,
      ownerPrice: basePrice,
      age: parseInt(age),
      toolUsage: parseInt(toolUsage),
      previousRentals: parseInt(previousRentals),
      calculatedPrice: finalCalculatedPrice,
      finalPrice,
      photos: photosBase64,
      dateRange: { 
        start: startDate, 
        end: endDate 
      }
    });

    await newProduct.save();
    res.status(200).json({ 
      message: 'Product added successfully', 
      product: newProduct 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ 
      message: 'Failed to add product', 
      error: error.toString() 
    });
  }
};

// Update the getProducts function to include new fields
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    const transformedProducts = products.map(product => ({
      title: product.title,
      photos: product.photos,
      condition: product.condition,
      ownerPrice: product.ownerPrice,
      finalPrice: product.finalPrice,
      age: product.age,
      toolUsage: product.toolUsage,
      previousRentals: product.previousRentals,
      productId: product._id,
    }));

    res.status(200).json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Failed to fetch products', 
      error: error.toString() 
    });
  }
};

// Update the updateProduct function to handle new fields
exports.updateProduct = async (req, res) => {
  const { 
    title, 
    ownerPrice, 
    description, 
    age,
    toolUsage,
    previousRentals,
    startDate, 
    endDate 
  } = req.body;

  const productId = req.params.productId;

  try {
    let product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Recalculate the dynamic pricing
    const basePrice = parseFloat(ownerPrice);
    const ageFactor = Math.max(0.5, 1 - (age * 0.05));
    const usageFactor = Math.max(0.6, 1 - ((toolUsage / 1000) * 0.02));
    const popularityFactor = Math.min(1.2, 1 + (previousRentals * 0.02));
    const finalCalculatedPrice = Math.round((basePrice * ageFactor * usageFactor * popularityFactor));
    const finalPrice = Math.round((basePrice + finalCalculatedPrice) / 2);

    // Update product information
    product.title = title;
    product.ownerPrice = basePrice;
    product.description = description;
    product.age = parseInt(age);
    product.toolUsage = parseInt(toolUsage);
    product.previousRentals = parseInt(previousRentals);
    product.calculatedPrice = finalCalculatedPrice;
    product.finalPrice = finalPrice;
    product.dateRange = {
      start: startDate,
      end: endDate
    };

    await product.save();
    res.json({ msg: 'Product updated successfully', product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Keep other existing functions as they are...
exports.getProductInfo = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error('Error retrieving product information:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve product information', 
      error: error.toString() 
    });
  }
};

exports.getUserProduct = async (req, res) => {
  try {
    const userId = req.query.userId;
    const products = await Product.find({ user: userId });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ 
      message: 'Failed to delete product', 
      error: error.message 
    });
  }
};