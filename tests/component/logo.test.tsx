import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo, Mark } from "@/components/brand/Logo";

describe("<Logo />", () => {
  it("exposes a single accessible name", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: "Chumbuo" })).toBeInTheDocument();
    // Inner mark and wordmark are decorative so screen readers don't announce it twice.
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("renders the tagline in the stacked lockup", () => {
    render(<Logo variant="stacked" tagline="Little moments. Lasting stories." />);
    expect(screen.getByText("Little moments. Lasting stories.")).toBeInTheDocument();
  });

  it("titled mark is announced; untitled is decorative", () => {
    const { container, rerender } = render(<Mark />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
    rerender(<Mark title="Chumbuo" />);
    expect(screen.getByRole("img", { name: "Chumbuo" })).toBeInTheDocument();
  });
});
