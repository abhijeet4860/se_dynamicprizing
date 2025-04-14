import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Productinfo.css';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import ToastContainer CSS
import Navbar from './Navbar';
import Footer from './Footer';

const ProductInfo = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [ownerName, setOwnerName] = useState('');
    const [product, setProduct] = useState(null); 
    const [activeImage, setActiveImage] = useState('');
    const [price, setPrice] = useState(0);
    const [currentUserEmail, setCurrentUserEmail] = useState(''); 
    const [ownerId, setOwnerId] = useState('');


    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/product-info/${productId}`)
            .then(response => {
                const fetchedProduct = response.data.product;
                setProduct(fetchedProduct);
                setPrice(fetchedProduct.price);
                if (fetchedProduct.photos && fetchedProduct.photos.length > 0) {
                    setActiveImage(fetchedProduct.photos[0]);
                }
    
                axios.get(`http://localhost:5000/api/products/get-username/${fetchedProduct.user}`)
                    .then(userResponse => {
                        const userDetails = userResponse.data;
                        setOwnerName(userDetails.userName);
                        setCurrentUserEmail(userDetails.userEmail); // Set currentUserEmail state
                        setOwnerId(userDetails.userId); // Set ownerId state
                    })
                    .catch(error => console.error('Error fetching user details:', error));
    
            })
            .catch(error => console.error('Error fetching product:', error));
    }, [productId]);
    

    const changeImage = (imageUrl) => {
        setActiveImage(imageUrl);
    };

    const handleBookNow = () => {
        if (localStorage.getItem('email') === currentUserEmail) {
            toast.error("User cannot buy your own product");
        } else {
            navigate(`/deliveryfrom?price=${price}&ownerId=${ownerId}`); 
        }
    };
    

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (!product) {
        return <div>Loading...</div>; 
    }

    return (
        <>
            <Navbar />
            <div className="productInfo-page">
                <main className="productInfo-container">
                    <div className="productInfo-images">
                        <img src={activeImage} alt="Active Product" className="productInfo-activeImage"/>
                        <div className="productInfo-thumbnails">
                            {product.photos.map((image, index) => (
                                <img key={index} src={image} alt={`Product Thumbnail ${index + 1}`} onClick={() => changeImage(image)} className="productInfo-thumbnail"/>
                            ))}
                        </div>
                    </div>
                    <div className="productInfo-details">
                        <h1 className="productInfo-title">{product.title}</h1>
                        <h2 className="productInfo-price">₹{product.price}</h2>
                        <p className="productInfo-description">{product.description}</p>
                        <p><strong>Owner Name:</strong> {ownerName}</p>
                        <p><strong>Location:</strong> {product.location}</p>
                        <p><strong>Available:</strong> {formatDate(product.dateRange.start)} - {formatDate(product.dateRange.end)}</p>
                        <p><strong>Type:</strong> {product.category}</p>
                        <button onClick={handleBookNow} className="productInfo-addToCart">Book now</button>
                    </div>
                </main>
            </div>
            <Footer />
            <ToastContainer /> 
        </>
    );
};

export default ProductInfo;
