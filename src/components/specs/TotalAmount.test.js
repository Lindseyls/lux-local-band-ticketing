import { render, screen } from "@testing-library/react";
import TotalAmount from "../TotalAmount";
import "@testing-library/jest-dom";

describe("TotalAmount component", () => {
  test("renders correct total based on ticket types and quantities", () => {
    const ticketTypes = [{ price: 20.0 }, { price: 40.0 }, { price: 75.0 }];
    const quantities = [1, 2, 1];
    // 20.00 * 1 + 40.00 * 2 + 75.00 * 1 = 175.00
    render(<TotalAmount ticketTypes={ticketTypes} quantities={quantities} />);
    expect(screen.getByText("$175.00")).toBeInTheDocument();
  });

  test("renders $0.00 when quantities are empty", () => {
    const ticketTypes = [{ price: 20.0 }, { price: 40.0 }];
    const quantities = [];
    render(<TotalAmount ticketTypes={ticketTypes} quantities={quantities} />);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  test("renders $0.00 when both inputs are empty arrays", () => {
    const ticketTypes = [];
    const quantities = [];
    render(<TotalAmount ticketTypes={ticketTypes} quantities={quantities} />);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  test("gracefully handles missing price values", () => {
    const ticketTypes = [{}, { price: 20.0 }];
    const quantities = [2, 1];
    // 0 * 2 + 20.00 * 1 = 20.00
    render(<TotalAmount ticketTypes={ticketTypes} quantities={quantities} />);
    expect(screen.getByText("$20.00")).toBeInTheDocument();
  });

  test("gracefully handles extra quantities beyond ticket types", () => {
    const ticketTypes = [{ price: 20.0 }];
    const quantities = [2, 99];
    // Only first quantity is used: 20.00 * 2 = 40.00
    render(<TotalAmount ticketTypes={ticketTypes} quantities={quantities} />);
    expect(screen.getByText("$40.00")).toBeInTheDocument();
  });

  test("renders correct total when all quantities are zero", () => {
    const ticketTypes = [{ price: 20.0 }, { price: 40.0 }];
    const quantities = [0, 0];
    render(<TotalAmount ticketTypes={ticketTypes} quantities={quantities} />);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });
});
