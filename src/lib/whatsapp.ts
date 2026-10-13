/**
 * WhatsApp's click-to-chat link, with the message already written. WhatsApp opens (the app on a
 * phone, WhatsApp Web on a computer) with the text waiting in the box — the guest reviews it and
 * presses Send themselves.
 *
 * `phone` is the number in international format; any "+", spaces or dashes are ignored, so
 * "+91 94065 25259" and "919406525259" are the same. With no number, WhatsApp lets the guest
 * choose who to send to.
 */
export function whatsappUrl(phone: string | undefined, text: string) {
  const number = (phone ?? "").replace(/\D/g, "");
  // URLSearchParams writes a space as "+"; %20 is the unambiguous form for a chat link.
  const query = new URLSearchParams({ text }).toString().replace(/\+/g, "%20");
  return `https://wa.me/${number}?${query}`;
}
