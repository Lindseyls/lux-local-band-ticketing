import { render, screen } from "@testing-library/react";
import App from "../../App";

// Mock the Supabase client
jest.mock("../../supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: null,
        error: null,
      })),
    })),
  },
}));

const mockBands = [
  {
    id: 1,
    name: "Test Band",
    date: "2026-08-15T20:00:00+00:00",
    location: "Showbox, Seattle, WA",
    description: "<div><b>Come see the best Test Band!</b></div>",
    image_url: "https://placehold.co/600x400",
    ticket_types: [
      {
        id: 1,
        band_id: 1,
        name: "General Admission",
        description: "Join us on the floor!",
        price: 20.0,
      },
      {
        id: 2,
        band_id: 1,
        name: "Early Entry + Drink Ticket",
        description: "Get in early!",
        price: 40.0,
      },
    ],
  },
];

describe("App component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading message initially", () => {
    // Mock Supabase to return unresolved promise
    require("../../supabaseClient").supabase.from.mockReturnValue({
      select: jest.fn(() => new Promise(() => {})),
    });

    render(<App />);
    expect(screen.getByText("Loading bands...")).toBeInTheDocument();
  });

  test("renders band selector after successful fetch", async () => {
    // Mock Supabase to return band data
    require("../../supabaseClient").supabase.from.mockReturnValue({
      select: jest.fn(() => Promise.resolve({ data: mockBands, error: null })),
    });

    render(<App />);

    expect(screen.getByText("Loading bands...")).toBeInTheDocument();

    const dropdown = await screen.findByRole("combobox");
    expect(dropdown).toBeInTheDocument();

    const option = await screen.findByRole("option", { name: "Test Band" });
    expect(option).toBeInTheDocument();
  });

  test("renders fallback when fetch returns empty list", async () => {
    // Mock Supabase to return empty array
    require("../../supabaseClient").supabase.from.mockReturnValue({
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
    });

    render(<App />);

    const fallback = await screen.findByText("No bands available");
    expect(fallback).toBeInTheDocument();
  });

  test("renders error to console if fetch fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Mock Supabase to return an error
    require("../../supabaseClient").supabase.from.mockReturnValue({
      select: jest.fn(() =>
        Promise.resolve({ data: null, error: new Error("Failed to fetch") }),
      ),
    });

    render(<App />);

    const fallback = await screen.findByText("No bands available");
    expect(fallback).toBeInTheDocument();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
