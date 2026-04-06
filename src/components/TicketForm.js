import { useState, useEffect } from "react";
import TicketType from "./TicketType";
import TotalAmount from "./TotalAmount";
import PaymentForm from "./PaymentForm";
import { supabase } from "../supabaseClient";

/**
 * Functional component that allows the user to select their ticket options and
 * enter their personal and payment information.
 * Displayed as the right column on the page.
 */
function TicketForm({ bandName, bandId, ticketTypes }) {
  // Track the quantity of tickets selected (array of nums).
  const [quantities, setQuantities] = useState(
    ticketTypes.map(() => 0), // initialize all to 0
  );
  // Adding payment validation.
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [paymentData, setPaymentData] = useState({});

  const hasSelectedTickets = quantities.some(
    (selectedTicketNum) => selectedTicketNum > 0,
  );
  const isTicketFormValid = hasSelectedTickets && isPaymentValid;

  // Reset quantities when ticketTypes change (e.g., band change).
  useEffect(() => {
    setQuantities(ticketTypes.map(() => 0));
  }, [ticketTypes]);

  // Updates the quantity for a given ticket index.
  const handleQuantityChange = (index, value) => {
    const update = [...quantities];
    update[index] = value;
    setQuantities(update);
  };

  // Handles form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Destructure paymentData for cleaner access
    const { firstName, lastName, email, phone, zipCode } = paymentData;

    try {
      // Step 1: Check if customer already exists by email
      const { data: customerData, error: customerFetchError } = await supabase
        .from("customers")
        .select("*")
        .eq("email", email);

      if (customerFetchError) throw customerFetchError;

      // If no customer found, create one
      const existingCustomer = customerData?.[0] || null;
      let customerId;

      if (!existingCustomer) {
        // Step 2: Create new customer
        const { data: newCustomerData, error: customerCreateError } =
          await supabase
            .from("customers")
            .insert({
              first_name: firstName,
              last_name: lastName,
              email: email,
              phone: phone || null,
              zip_code: zipCode,
            })
            .select();

        if (customerCreateError) throw customerCreateError;
        customerId = newCustomerData[0].id;
      } else {
        customerId = existingCustomer.id;
      }

      // Step 3: Calculate total
      const total = ticketTypes.reduce((sum, ticket, index) => {
        return sum + ticket.price * quantities[index];
      }, 0);

      // Step 4: Create the order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: customerId,
          band_id: bandId,
          total_amount: total,
          payment_status: "pending",
        })
        .select();

      if (orderError) throw orderError;

      // Step 5: Create order items for each ticket type selected
      const orderItems = ticketTypes
        .map((ticket, index) => ({
          order_id: orderData[0].id,
          ticket_type_id: ticket.id,
          quantity: quantities[index],
          price_at_purchase: ticket.price,
        }))
        .filter((item) => item.quantity > 0);

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (orderItemsError) throw orderItemsError;

      // Step 6: Success!
      alert(
        `Order confirmed! Thank you ${firstName}!\n` +
          `Check ${email} for your ticket confirmation.\n` +
          `Total: $${total.toFixed(2)}`,
      );
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Something went wrong processing your order. Please try again.");
    }
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <h2 className="ticket-form-title">Select Tickets</h2>
      {ticketTypes.map((ticket, index) => (
        <TicketType
          key={ticket.name}
          ticket={ticket}
          quantity={quantities[index]}
          onQuantityChange={(val) => handleQuantityChange(index, val)}
        />
      ))}
      <TotalAmount ticketTypes={ticketTypes} quantities={quantities} />
      <PaymentForm
        onValidChange={setIsPaymentValid}
        onFormDataChange={setPaymentData}
      />
      <button
        type="submit"
        disabled={!isTicketFormValid}
        className="purchase-button"
      >
        Get Tickets
      </button>
    </form>
  );
}

export default TicketForm;
