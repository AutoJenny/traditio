export default function Delivery() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase text-espresso mb-6 text-center">Delivery</h1>
      
      <div className="font-body text-sand space-y-6">
        <section>
          <h2 className="text-2xl text-espresso font-semibold mb-3">Bespoke Delivery Solutions</h2>
          <p>
            At Traditio, we arrange delivery on a per-item basis, tailoring our approach to the specific needs of each piece and your location. As antique and unique items often require special handling, we work with specialist couriers who understand the care required.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl text-espresso font-semibold mb-3">Costs & Insurance</h2>
          <p className="mb-3">
            Delivery is charged at cost price with no markup from us. All shipments are fully insured for their value, giving you complete peace of mind. Once you've made your purchase, we'll provide you with a detailed quote based on:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>The size and fragility of the item</li>
            <li>Your delivery location</li>
            <li>Any special handling requirements</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl text-espresso font-semibold mb-3">Collection</h2>
          <p>
            We're pleased to offer free collection from our Edinburgh location. This can be arranged at a mutually convenient time, and we're happy to help load your purchase into your vehicle. Collection is often the best option for local customers or those who wish to personally inspect their purchase before taking it home.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl text-espresso font-semibold mb-3">Timeframes</h2>
          <p>
            We normally arrange shipping within a few days of purchase. As a family business, however, there may occasionally be slight delays depending on our schedule and the availability of our specialist couriers. We'll always keep you informed and provide tracking information once your item is dispatched.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl text-espresso font-semibold mb-3">International Shipping</h2>
          <p>
            Yes, we do ship internationally! Please note that international deliveries may be subject to import duties and taxes, which are the responsibility of the recipient. We'll handle all the necessary paperwork and provide guidance on the process.
          </p>
        </section>
        
        <div className="mt-8 p-4 bg-ivory border border-sand rounded-md">
          <p className="italic text-center">
            For specific delivery enquiries, please contact us directly via the product enquiry form or email us at <span className="text-brass">info@traditio.co.uk</span>
          </p>
        </div>
      </div>
    </main>
  );
} 