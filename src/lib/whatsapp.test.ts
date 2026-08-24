/** Cheeseful Bites ordering utility tests: verify cart details remain intact through WhatsApp handoff. */
import { describe, expect, it } from "vitest";
import { buildWhatsAppOrderMessage, getWhatsAppOrderUrl } from "./whatsapp";

describe("WhatsApp order formatter", () => {
  it("includes cart lines, totals, delivery information, payment, and customer notes", () => {
    const message = buildWhatsAppOrderMessage({
      lines: [{ quantity: 2, title: "Zinger Roll Paratha", total: "Rs. 600" }],
      subtotal: "Rs. 600",
      deliveryFee: "Rs. 99",
      total: "Rs. 699",
      streetAddress: "Lane 21",
      city: "Wah",
      postalCode: "47010",
      payment: "Cash on Delivery",
      instructions: "Please call on arrival.",
    });
    expect(message).toContain("2 × Zinger Roll Paratha — Rs. 600");
    expect(message).toContain("Total: Rs. 699");
    expect(message).toContain("Lane 21, Wah, 47010");
    expect(message).toContain("Notes: Please call on arrival.");
  });

  it("targets the configured business WhatsApp number with encoded text", () => {
    const url = getWhatsAppOrderUrl("Hello Cheeseful Bites!");
    expect(url).toContain("wa.me/923288681123");
    expect(url).toContain("Hello%20Cheeseful%20Bites");
  });
});

