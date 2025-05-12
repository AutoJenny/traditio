export default function Reviews() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4 text-center">
      <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase text-espresso mb-6">Customer Reviews</h1>
      <p className="font-body text-lg text-sand mb-8">We're proud of the trust our clients place in us. Here's what some of our customers have to say:</p>
      <div className="mb-8">
        <blockquote className="font-body text-base text-espresso italic mb-4">"A wonderful experience from start to finish. The piece I purchased is even more beautiful in person."</blockquote>
        <span className="font-body text-sand block mb-6">— Emily, Edinburgh</span>
        <blockquote className="font-body text-base text-espresso italic mb-4">"Traditio Interiors helped me find the perfect mirror for my hallway. Friendly, knowledgeable, and passionate about what they do."</blockquote>
        <span className="font-body text-sand block mb-6">— James, Glasgow</span>
        <blockquote className="font-body text-base text-espresso italic mb-4">"Excellent service and a truly unique selection. I'll be back!"</blockquote>
        <span className="font-body text-sand block">— Sophie, London</span>
      </div>
      <h2 className="font-heading text-xl text-espresso font-bold mb-2 mt-8">Share Your Experience</h2>
      <p className="font-body text-base text-sand mb-2">We value your feedback. If you'd like to leave a review, please email us at <a href="mailto:reviews@traditiointeriors.com" className="text-brass underline">reviews@traditiointeriors.com</a>.</p>
    </main>
  );
} 