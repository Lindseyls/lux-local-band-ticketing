import { useState, useEffect } from "react";
import { ImCreditCard } from "react-icons/im";

function PaymentForm({ onValidChange, onFormDataChange }) {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cvv: "",
    email: "",
    expiry: "",
    firstName: "",
    lastName: "",
    phone: "",
    zipCode: "",
  });

  useEffect(() => {
    // Phone is optional so exclude it from required fields check
    const { phone, ...requiredFields } = formData;
    const allFilled = Object.values(requiredFields).every(
      (val) => val.trim() !== "",
    );
    onValidChange(allFilled);
    onFormDataChange(formData);
  }, [formData, onValidChange, onFormDataChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="payment-form">
      <div className="name-fields">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        className="payment-input-full"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number (optional)"
        value={formData.phone}
        onChange={handleChange}
        className="payment-input-full"
      />
      <h4>Payment Details</h4>
      <div className="card-input-with-icon">
        <input
          type="text"
          name="cardNumber"
          placeholder="0000 0000 0000 0000"
          value={formData.cardNumber}
          onChange={handleChange}
        />
        <ImCreditCard className="card-icon" />
      </div>
      <div className="card-details">
        <input
          type="text"
          name="expiry"
          placeholder="MM / YY"
          value={formData.expiry}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          value={formData.cvv}
          onChange={handleChange}
        />
        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          value={formData.zipCode}
          onChange={handleChange}
          className="payment-input-zip"
        />
      </div>
    </div>
  );
}

export default PaymentForm;
