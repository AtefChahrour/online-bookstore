import React from "react";
import Navbar from "../components/Navbar";
import "./Contact.css";

function Contact() {
  return (
    <>
      <Navbar />

      <div className="contact-container">
        <h1>Contact Us</h1>

        <div className="contact-info">

          <p><strong>Email:</strong> 12032218@students.liu.edu.lb</p>

          <p><strong>Phone:</strong> +961 76 452 891</p>

          <p><strong>Address:</strong> 123 Cedar Avenue, Beirut, Lebanon</p>

        </div>
      </div>
    </>
  );
}

export default Contact;
