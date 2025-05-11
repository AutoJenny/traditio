import Image from "next/image";

export default function Home() {
  return (
    <section className="bg-ivory rounded-lg shadow p-10 text-center border-4 border-brass mt-8">
      <h1 className="text-4xl font-bold mb-4 text-brass font-serif">Welcome to Traditio Interiors</h1>
      <p className="text-lg text-espresso mb-6 font-sans">
        Inspired by timeless design and contemporary aesthetics, we offer interiors that tell stories.
      </p>
      <Image src="/traditio_logo.png" alt="Traditio Logo" width={96} height={96} className="mx-auto h-24 w-auto mt-6" />
    </section>
  );
}
