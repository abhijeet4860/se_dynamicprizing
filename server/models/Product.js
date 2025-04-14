const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    brand: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true, enum: ['Daily Rental', 'Hourly Rental'] },
    title: { type: String, required: true },
    equipmentType: { type: String, required: true },
    condition: { type: String, required: true },
    description: { type: String, required: true },
    age: { type: Number, required: true }, // Equipment age in years
    toolUsage: { type: Number, required: true }, // Hours of usage
    previousRentals: { type: Number, default: 0 }, // Number of times rented
    ownerPrice: { type: Number, required: true }, // Owner's set price
    calculatedPrice: { type: Number }, // Dynamically calculated price
    finalPrice: { type: Number }, // Final price after calculations
    photos: [String],
    dateRange: {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    },
}, { timestamps: true });

// Add a pre-save middleware to calculate the dynamic price
productSchema.pre('save', function(next) {
    // Base price is the owner's set price
    let basePrice = this.ownerPrice;
    
    // Age factor (reduces price by 5% per year, max 50% reduction)
    const ageFactor = Math.max(0.5, 1 - (this.age * 0.05));
    
    // Usage factor (reduces price by 2% per 1000 hours of use, max 40% reduction)
    const usageFactor = Math.max(0.6, 1 - ((this.toolUsage / 1000) * 0.02));
    
    // Popularity factor (increases price by 2% per previous rental, max 20% increase)
    const popularityFactor = Math.min(1.2, 1 + (this.previousRentals * 0.02));
    
    // Calculate the dynamic price
    this.calculatedPrice = basePrice * ageFactor * usageFactor * popularityFactor;
    
    // Set the final price (average of owner's price and calculated price)
    this.finalPrice = Math.round((this.ownerPrice + this.calculatedPrice) / 2);
    
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;