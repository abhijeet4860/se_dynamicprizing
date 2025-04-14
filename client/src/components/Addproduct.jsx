import React, { useState, useEffect } from 'react';
import './Addproduct.css';
import Navbar from './Navbar';
import Footer from './Footer';
import BasicDateRangePicker from './Daterange';
import { addProductRoute } from '../utils/APIroutes';
import SuccessPopup from '../popups/SuccessPopup';
import FailurePopup from '../popups/FailurePopup';
import { useNavigate } from 'react-router-dom';

const MyForm = () => {
  const [photos, setPhotos] = useState([]);
  const [brand, setBrand] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('select');
  const [title, setTitle] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [age, setAge] = useState('');
  const [toolUsage, setToolUsage] = useState('');
  const [previousRentals, setPreviousRentals] = useState('0');
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const navigate = useNavigate();

  // Function to calculate estimated price
  const calculateEstimatedPrice = (ownerPrice, age, usage, rentals) => {
    const basePrice = parseFloat(ownerPrice);
    if (!basePrice || !age || !usage) return null;

    const ageFactor = Math.max(0.5, 1 - (age * 0.05));
    const usageFactor = Math.max(0.6, 1 - ((usage / 1000) * 0.02));
    const popularityFactor = Math.min(1.2, 1 + (rentals * 0.02));
    
    const calculated = basePrice * ageFactor * usageFactor * popularityFactor;
    return Math.round((basePrice + calculated) / 2);
  };

  // Update price calculation when relevant fields change
  useEffect(() => {
    const estimated = calculateEstimatedPrice(price, age, toolUsage, previousRentals);
    setCalculatedPrice(estimated);
  }, [price, age, toolUsage, previousRentals]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`);
        const data = await response.json();
        if (data.status === 'OK') {
          setLocation(data.results[0].formatted_address);
        } else {
          alert('Geolocation is not available');
        }
      }, () => {
        alert('Unable to retrieve your location');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handlePhotoChange = (event) => {
    if (event.target.files) {
      setPhotos(event.target.files);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    const token = localStorage.getItem('token');

    for (let i = 0; i < photos.length; i++) {
      formData.append('photos', photos[i]);
    }

    formData.append('brand', brand);
    formData.append('location', location);
    formData.append('category', category);
    formData.append('title', title);
    formData.append('equipmentType', equipmentType);
    formData.append('condition', condition);
    formData.append('description', description);
    formData.append('ownerPrice', price);
    formData.append('age', age);
    formData.append('toolUsage', toolUsage);
    formData.append('previousRentals', previousRentals);
    formData.append('calculatedPrice', calculatedPrice);
    formData.append('dateRange', JSON.stringify(dateRange));

    try {
      const response = await fetch(addProductRoute, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error adding product:', error);
      setShowFailurePopup(true);
      setTimeout(() => {
        setShowFailurePopup(false);
      }, 3000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="form-container">
        <div className="form-header">
          <h2>Describe Your Equipment</h2>
          <p>Provide key details of your equipment to Sell Or Rent Out</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label htmlFor="category">Selected Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="select">Select</option>
              <option value="Daily Rental">Daily Rental</option>
              <option value="Hourly Rental">Hourly Rental</option>
            </select>
          </div>

          <div className="form-section">
            <label htmlFor="title">Model</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="form-section">
            <label htmlFor="brand">Brand</label>
            <input type="text" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Enter brand name" required />
          </div>

          <div className="form-section">
            <label htmlFor="equipmentType">Equipment Type</label>
            <input type="text" id="equipmentType" value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)} required />
          </div>

          <div className="form-section">
            <label htmlFor="age">Equipment Age (years)</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="toolUsage">Total Usage Hours</label>
            <input
              type="number"
              id="toolUsage"
              value={toolUsage}
              onChange={(e) => setToolUsage(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="previousRentals">Previous Rental Count</label>
            <input
              type="number"
              id="previousRentals"
              value={previousRentals}
              onChange={(e) => setPreviousRentals(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="condition">Condition</label>
            <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} required>
              <option value="">Select</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Refurbished">Refurbished</option>
            </select>
          </div>

          <div className="form-section">
            <label htmlFor="description">Description *</label>
            <textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Include condition, features and reason for selling"
              required
            ></textarea>
          </div>

          <div className="form-section">
            <label htmlFor="price">Set Your Price (Owner's Price)</label>
            <input 
              type="number" 
              id="price" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              required 
            />
          </div>

          {calculatedPrice && (
            <div className="price-preview">
              <h3>Price Analysis</h3>
              <div className="price-details">
                <p>Your Price: ${price}</p>
                <p>Suggested Price: ${calculatedPrice}</p>
                <p className="price-factors">
                  Factors considered:
                  <ul>
                    <li>Equipment age: {age} years</li>
                    <li>Usage hours: {toolUsage} hours</li>
                    <li>Previous rentals: {previousRentals}</li>
                  </ul>
                </p>
                <p className="price-note">Final price will be calculated based on these factors</p>
              </div>
            </div>
          )}

          <div className="form-section">
            <label htmlFor="photo">Upload Photos</label>
            <input type="file" id="photo" onChange={handlePhotoChange} multiple required />
          </div>

          <div className="form-section">
            <h4>Select Date Range:</h4>
            <BasicDateRangePicker daterange={dateRange} setDateRange={setDateRange} />
          </div>

          <div className="form-section">
            <label htmlFor="location">Add Address (manual or use GPS)</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location or use your GPS"
              required
            />
            <button type="button" onClick={getCurrentLocation}>Use Current Location</button>
          </div>

          <div className="form-container">
            {showSuccessPopup && <SuccessPopup message="Product added successfully!" />}
            {showFailurePopup && <FailurePopup message="Failed to add product. Please try again." />}
          </div>

          <button type="submit" className="submit-button">Add Product</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default MyForm;