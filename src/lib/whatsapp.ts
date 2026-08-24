/**
 * Cheeseful Bites ordering utility: composes a transparent customer-approved WhatsApp
 * handoff from the cart without sending data automatically or storing an order externally.
 */
export type WhatsAppLine = { quantity: number; title: string; total: string };

export function buildWhatsAppOrderMessage(input: {
  lines: WhatsAppLine[];
  subtotal: string;
  deliveryFee: string;
  total: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  payment: string;
  instructions?: string;
}) {
  const orderLines = input.lines.map((line) => `• ${line.quantity} × ${line.title} — ${line.total}`).join("\n");
  return [
    "Hello Cheeseful Bites! I would like to confirm this order:",
    "",
    orderLines,
    "",
    `Subtotal: ${input.subtotal}`,
    `Delivery: ${input.deliveryFee}`,
    `Total: ${input.total}`,
    "",
    "Delivery details:",
    `${input.streetAddress}, ${input.city}, ${input.postalCode}`,
    `Payment: ${input.payment}`,
    input.instructions ? `Notes: ${input.instructions}` : "",
  ].filter(Boolean).join("\n");
}

export function getWhatsAppOrderUrl(message: string) {
  return `https://wa.me/923288681123?text=${encodeURIComponent(message)}`;
}

