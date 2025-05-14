import React from 'react';

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 md:px-0">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-espresso">Terms &amp; Conditions</h1>
      <section className="mb-8">
        <h2 className="font-heading text-xl font-bold mb-2">Welcome to Traditio Interiors</h2>
        <p>
          We want your experience with us to be as smooth and enjoyable as possible. Please read these Terms &amp; Conditions carefully before making a purchase. By using our website or buying from us, you agree to these terms.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="font-heading text-lg font-bold mb-2">Product Descriptions &amp; Accuracy</h2>
        <p>
          We do our very best to describe our products accurately and provide clear photographs. However, as many of our items are vintage or antique, some details may be subjective or open to interpretation. While we strive for accuracy, we cannot guarantee that every description, measurement, or image is perfectly precise. If you have any questions or need more information, please <a href="/contact" className="text-brass underline">contact us</a> before purchasing.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="font-heading text-lg font-bold mb-2">Orders &amp; Payment</h2>
        <p>
          Orders are accepted subject to availability. Payment is required in full before dispatch. We accept major credit and debit cards, and all payments are processed securely. We reserve the right to take reasonable steps to verify your identity prior to dispatch to protect ourselves from the risk of fraud, or to cancel any order at any time. An order is confirmed only at the point of dispatch.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="font-heading text-lg font-bold mb-2">Delivery</h2>
        <p>
          We aim to dispatch items promptly and will keep you informed about delivery times. Please see our <a href="/delivery" className="text-brass underline">Delivery</a> page for more details. Delivery times are estimates and may vary due to circumstances beyond our control.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="font-heading text-lg font-bold mb-2">Returns &amp; Cancellations</h2>
        <p>
          We want you to be happy with your purchase. If you change your mind, you can return most items within 14 days of receipt for a refund, provided they are in their original condition. Please see our <a href="/returns" className="text-brass underline">Returns</a> page for full details and instructions. Custom or special order items may not be eligible for return.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="font-heading text-lg font-bold mb-2">Liability</h2>
        <p>
          We take care to ensure our products are described and delivered as promised. However, to the fullest extent permitted by law, Traditio Interiors cannot accept liability for any loss or damage arising from the use of our website or products, except where required by law. Our liability is limited to the purchase price of the item. Any disputes will be subject to Scottish law and jurisdiction. 
        </p>
      </section>
      <section className="mb-6">
        <h2 className="font-heading text-lg font-bold mb-2">Privacy</h2>
        <p>
          Your privacy is important to us. Please see our <a href="/privacy" className="text-brass underline">Privacy Policy</a> for details on how we handle your information.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="font-heading text-lg font-bold mb-2">Contact</h2>
        <p>
          If you have any questions about these terms or anything else, please <a href="/contact" className="text-brass underline">Contact Us</a>. We're here to help!
        </p>
      </section>
    </main>
  );
} 