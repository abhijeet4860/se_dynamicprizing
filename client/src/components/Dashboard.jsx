// Dashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import edit icon
import './Dashboard.css'; // Make sure this file path is correct
import Navbar from './Navbar';
import Footer from './Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Dashboard() {
    const [userDetails, setUserDetails] = useState(null);
    const [products, setProducts] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedProduct, setEditedProduct] = useState({
        _id: '',
        title: '',
        price: '',
        description: '',
        startDate: new Date(),
        endDate: new Date()
    });

    const fetchProducts = async (token) => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/get-userproduct', {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Assuming you store the JWT token in local storage
                },
                params: {
                    userId: userDetails._id // Pass user ID as a query parameter
                }
            });
            setProducts(response.data);
        } catch (error) {
            // Handle error
            console.error('Failed to fetch products:', error);
        }
    };

    useEffect(() => {
        // Fetch user details from the server
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users/userdetails', {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token // Assuming you store the JWT token in local storage
                    }
                });
                setUserDetails(prevDetails => ({ ...prevDetails, ...response.data }));
                // Call fetchProducts here
                fetchProducts(token);
            } catch (error) {
                // Handle error
                console.error('Failed to fetch user details:', error);
            }
        };

        fetchUserDetails();
    }, [fetchProducts]); // Include fetchProducts in the dependency array

    const handleDeleteProduct = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/products/delete-product/${productId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            });
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };
    

    const handleEditProduct = (product) => {
        // Open edit modal and set edited product details
        setEditedProduct({
            _id: product._id,
            title: product.title,
            price: product.price,
            description: product.description,
            startDate: new Date(product.dateRange.start),
            endDate: new Date(product.dateRange.end)
        });
        setEditModalVisible(true);
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            // Construct the request body with edited product data
            const requestBody = {
                title: editedProduct.title,
                price: editedProduct.price,
                description: editedProduct.description,
                startDate: editedProduct.startDate,
                endDate: editedProduct.endDate
            };

            // Send the PUT request to update the product information
            await axios.put(`http://localhost:5000/api/products/update-product/${editedProduct._id}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Assuming you store the JWT token in local storage
                }
            });

            // Close the modal
            setEditModalVisible(false);

            // Clear the edited product state
            setEditedProduct({
                _id: '',
                title: '',
                price: '',
                description: '',
                startDate: new Date(),
                endDate: new Date()
            });

            // Refetch products to reflect changes
            fetchProducts(token);
        } catch (error) {
            // Handle error
            console.error('Failed to save edited product:', error);
        }
    };

    const handleEditInputChange = (e) => {
        // Update edited product state when input values change
        setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Navbar />
            <br />
            <div className="dashboard">
                {/* Sidebar starts */}
                <div className="sidebar">
                    <div className="logo">
                        {/* Put your logo here */}
                        <span>OPTIONS</span>
                    </div>
                    <div className="menu">
                        {/* Sidebar menu items */}
                        <a href="/" className="menu-item active">Content</a>
                        <a href="/" className="menu-item">Start Selling</a>
                        <a href="/" className="menu-item">My adds</a>
                        <a href="/" className="menu-item">Chat</a>
                        <a href="/" className="menu-item">Help</a>
                        {/* Add more menu items here */}
                    </div>
                </div>
                {/* Sidebar ends */}

                {/* Main content starts */}
                <div className="main-content">
                    {/* Add your main content here */}
                    <div className="header">
                        {/* Your header content like search, profile info, etc */}
                    </div>
                    <div className="content">
                        {userDetails && <p className="user-name">
                            <span style={{ fontSize: '2em' }}>Hello, {userDetails.name}</span>
                        </p>}
                        {/* Display user's products */}
                        {products.length > 0 ? (
                            <div className="product-list">
                                <h2>Your Products:</h2>
                                <ul>
                                    {products.map(product => (
                                        <li key={product._id} className="product-item">
                                            <div className="product-details">
                                                <div>
                                                    <h3>{product.title}</h3>
                                                    <p>Price: ${product.price}</p>
                                                    <p>Description: {product.description}</p>
                                                    <p>Start Date: {new Date(product.dateRange.start).toLocaleDateString()}</p>
                                                    <p>End Date: {new Date(product.dateRange.end).toLocaleDateString()}</p>
                                                </div>
                                                <div className="product-icons">
                                                    <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDeleteProduct(product._id)} />
                                                    <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={() => handleEditProduct(product)} />
                                                    {/* Add edit icon */}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>No products found.</p>
                        )}
                    </div>
                </div>
                {/* Main content ends */}
            </div>
            {/* Edit modal */}
            {editModalVisible && (
                <div className="edit-modal-container">
                    <div className="edit-modal-content">
                        <span className="edit-modal-close" onClick={() => setEditModalVisible(false)}>&times;</span>
                        <h2 className="edit-modal-title">Edit Product</h2>
                        <input
                            className="edit-modal-input"
                            type="text"
                            placeholder="Title"
                            name="title"
                            value={editedProduct.title}
                            onChange={handleEditInputChange}
                        />
                        <input
                            className="edit-modal-input"
                            type="text"
                            placeholder="Price"
                            name="price"
                            value={editedProduct.price}
                            onChange={handleEditInputChange}
                        />
                        <textarea
                            className="edit-modal-textarea"
                            placeholder="Description"
                            name="description"
                            value={editedProduct.description}
                            onChange={handleEditInputChange}
                        />
                        <DatePicker
                            selected={editedProduct.startDate}
                            onChange={date => setEditedProduct({ ...editedProduct, startDate: date })}
                            selectsStart
                            startDate={editedProduct.startDate}
                            endDate={editedProduct.endDate}
                            placeholderText="Start Date"
                        />
                        <DatePicker
                            selected={editedProduct.endDate}
                            onChange={date => setEditedProduct({ ...editedProduct, endDate: date })}
                            selectsEnd
                            startDate={editedProduct.startDate}
                            endDate={editedProduct.endDate}
                            placeholderText="End Date"
                        />
                        <FontAwesomeIcon icon={faTimes} className="edit-modal-close-icon" onClick={() => setEditModalVisible(false)} />
                        <button className="edit-modal-save-btn" onClick={handleSaveEdit}>Save</button>
                    </div>
                </div>

            )}
            <Footer />
        </>
    );
}

export default Dashboard;
