import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo, Monogram } from "@/components/brand/Logo";

describe("<Logo />", () => {
  it("exposes a single accessible name", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: "Chumbuo" })).toBeInTheDocument();
    // Inner marks are decorative so screen readers don't announce it three times.
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("renders the tagline in the stacked lockup", () => {
    render(<Logo variant="stacked" tagline="Little moments. Lasting stories." />);
    expect(screen.getByText("Little moments. Lasting stories.")).toBeInTheDocument();
  });

  it("titled monogram is announced; untitled is hidden", () => {
    const { container, rerender } = render(<Monogram />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    rerender(<Monogram title="Chumbuo" />);
    expect(screen.getByRole("img", { name: "Chumbuo" })).toBeInTheDocument();
  });
});
