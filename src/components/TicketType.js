/**
 * Functional component that is the layout for all the ticket options for each band.
 * It takes in user input for selecting the quantity.
 */
function TicketType({ ticket, quantity, onQuantityChange }) {
  // Handle user input and sanitize non-numeric or negative values.
  const handleChange = (e) => {
    // Converts the form input from string into integer.
    const value = parseInt(e.target.value);

    if (!isNaN(value) && value >= 0) {
      onQuantityChange(value);
    } else {
      onQuantityChange(0);
    }
  };

  return (
    <div className="ticket-type">
      <div className="ticket-type-info">
        <h3>{ticket.name}</h3>
        <p className="ticket-description">{ticket.description}</p>
        <p className="ticket-price">${ticket.price.toFixed(2)}</p>
      </div>

      <input
        type="number"
        min="0"
        value={quantity ?? 0}
        onChange={handleChange}
        className="ticket-input"
      />
    </div>
  );
}

export default TicketType;
