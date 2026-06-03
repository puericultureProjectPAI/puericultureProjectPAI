// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import LeasingBookingSection from "../../src/leasing/components/LeasingBookingSection";
import * as AuthContext from "../../src/common/security/AuthContext";

// Mock useNavigate and useAuth hooks
vi.mock("react-router", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../../src/common/security/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../src/leasing/hooks/useLeasing", () => ({
  useSubmitBooking: vi.fn(),
}));

vi.mock("../../src/common/service/PersonService", () => ({
  usePerson: () => ({ data: null, error: null, loading: false }),
}));

afterEach(() => {
  cleanup();
});

describe("LeasingBookingSection Component", () => {
  it("renders the date input fields and the reserve button", () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
    });

    const { getByLabelText, getByText } = render(
      <LeasingBookingSection
        leasingId={1}
        productTitle="Poussette"
        pricePerMonth={9000}
        pricePerDay={500}
      />,
    );

    expect(getByLabelText("Début")).toBeDefined();
    expect(getByLabelText("Fin")).toBeDefined();
    expect(getByText("Réserver")).toBeDefined();
  });

  it("calculates and displays the estimated price dynamically when dates are entered", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "test" },
      loading: false,
    });

    const { getByLabelText, getByText } = render(
      <LeasingBookingSection
        leasingId={1}
        productTitle="Poussette"
        pricePerMonth={9000}
        pricePerDay={500}
      />,
    );

    const startInput = getByLabelText("Début");
    const endInput = getByLabelText("Fin");

    // Let's set start and end date to simulate a 5-day rental
    await act(async () => {
      fireEvent.change(startInput, { target: { value: "2026-06-10" } });
      fireEvent.change(endInput, { target: { value: "2026-06-14" } }); // 5 days inclusive
    });

    // Estimation: 5 days * 5 EUR/day = 25 EUR
    expect(getByText("25€")).toBeDefined();
    expect(getByText("5 jours")).toBeDefined();
  });

  it("calculates monthly prices correctly for rentals over 30 days", async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      isAuthenticated: true,
      user: { id: "test" },
      loading: false,
    });

    const { getByLabelText, getByText } = render(
      <LeasingBookingSection
        leasingId={1}
        productTitle="Poussette"
        pricePerMonth={9000}
        pricePerDay={500}
      />,
    );

    const startInput = getByLabelText("Début");
    const endInput = getByLabelText("Fin");

    // Let's set start and end date to simulate a 35-day rental
    await act(async () => {
      fireEvent.change(startInput, { target: { value: "2026-06-10" } });
      fireEvent.change(endInput, { target: { value: "2026-07-14" } }); // 35 days inclusive
    });

    // Estimation: 1 month * 90 EUR/month + 5 days * 5 EUR/day = 115 EUR
    expect(getByText("115€")).toBeDefined();
    expect(getByText(/35 jours/)).toBeDefined();
  });
});
