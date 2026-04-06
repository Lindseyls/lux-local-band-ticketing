/**
 * Functional component that displays the total ticket cost in the UI.
 */
function TotalAmount({ ticketTypes = [], quantities = [] }) {
  const total = ticketTypes.reduce((sum, ticket, index) => {
    const price = ticket?.price ?? 0;
    const quantity = quantities[index] ?? 0;
    return sum + price * quantity;
  }, 0);

  return (
    <div className="total-amount">
      <h3>TOTAL</h3>
      <p>${total.toFixed(2)}</p>
    </div>
  );
}

export default TotalAmount;
