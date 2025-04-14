import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Help.css'; // Make sure to create this CSS file
import Navbar from './Navbar';
import Footer from './Footer';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = React.useState(null);

  const questionsAnswers = {
    booking: [
      { question: 'How do I book an equipment on Krishi Sadhan?', answer: 'To book equipment on Krishi Sadhan, you can follow these steps:\n1. Log in to your Krishi Sadhan account.\n2. Browse through the available equipment listings.\n3. Select the equipment you want to book and click on the "Book Now" button.\n4. Choose the desired booking dates and any additional options.\n5. Confirm your booking by providing any required details and making the payment.\n6. Once confirmed, your booking will be processed, and you\'ll receive a confirmation email with further instructions.' },
      { question: 'What happens if I return the equipment late?', answer: 'If you return the equipment late, you may be subject to late fees as per Krishi Sadhan\'s late return policy. The late fee amount and duration may vary depending on the terms and conditions of your booking. We recommend returning the equipment on time to avoid any additional charges.' },
      { question: 'How do I lend my booking?', answer: 'To lend your booking to someone else, follow these steps:\n1. Log in to your Krishi Sadhan account.\n2. Go to your booking details.\n3. Look for the option to "Lend Booking" or "Transfer Booking."\n4. Follow the prompts to transfer the booking to another user.\n5. Ensure that the recipient receives all necessary booking details and instructions for a smooth handover.' },
    ],
    renting: [
      { question: 'How can I rent my equipment or implements?', answer: 'To rent out your equipment or implements on Krishi Sadhan, you can list them on our platform by following these steps:\n1. Log in to your Krishi Sadhan account.\n2. Navigate to the "List Equipment" or "List Implements" section.\n3. Fill out the required details about your equipment, including title, description, availability, pricing, and any other relevant information.\n4. Upload clear and high-quality images of your equipment.\n5. Submit your listing for review.\n6. Once approved, your equipment will be visible to users, and you can start receiving rental requests.' },
      { question: 'How do I refund my amount?', answer: 'To initiate a refund for your booking amount on Krishi Sadhan, please follow these steps:\n1. Log in to your Krishi Sadhan account.\n2. Go to your booking history or transaction details.\n3. Find the booking for which you want to request a refund.\n4. Look for the option to "Request Refund" or "Initiate Refund."\n5. Follow the provided instructions to submit your refund request.\n6. Once your request is submitted, our team will review it and process the refund according to our refund policy and timeline.' },
      { question: 'What types of equipment can I list for booking?', answer: 'Krishi Sadhan allows you to list a wide range of agricultural equipment and implements for booking. Some common types of equipment you can list include tractors, harvesters, plows, cultivators, planters, and more. Feel free to list any equipment that you own and are willing to rent out to other users. Please ensure that your listings comply with our guidelines and policies to provide a positive experience for all users.' },
    ],
  };

  const handleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="faq-section">
        <h2>How can we Help?</h2>
        <div className="faq-container">
          <div className="faq-block">
            <h3>Booking Help</h3>
            {questionsAnswers.booking.map((qa, index) => (
              <div key={index} className="faq-question" onClick={() => handleClick(index)}>
                <p>Q: {qa.question}</p>
                {activeIndex === index && <p>{qa.answer}</p>}
              </div>
            ))}
          </div>
          <div className="faq-block">
            <h3>Renting Help</h3>
            {questionsAnswers.renting.map((qa, index) => (
              <div key={index + questionsAnswers.booking.length} className="faq-question" onClick={() => handleClick(index + questionsAnswers.booking.length)}>
                <p>Q: {qa.question}</p>
                {activeIndex === index + questionsAnswers.booking.length && <p>{qa.answer}</p>}
              </div>
            ))}
          </div>
        </div>
        <button className="contact-us" style={{ backgroundColor: '#4CAF50' }}>
          <Link to="/contactus" style={{ textDecoration: 'none', color: 'white' }}>Contact Us</Link>
        </button> 
      </div>
      <Footer />
    </>
  );
};

export default FAQSection;
