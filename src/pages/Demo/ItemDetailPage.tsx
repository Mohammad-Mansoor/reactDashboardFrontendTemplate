import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const DEMO_ITEMS = [
  {
    id: "1",
    title: "Luxury Timepiece",
    description: "A masterclass in horological engineering. Features a custom tourbillon movement and sapphire crystal glass. Designed for those who appreciate the finer things in life.",
    image: "/images/demo/item1.png",
    price: "$2,499",
    specs: ["Swiss Made", "42mm Case", "Water Resistant 100m", "Leather Strap"]
  },
  {
    id: "2",
    title: "Designer Chair",
    description: "Form meets function in this award-winning piece. Crafted from sustainable oak and premium Italian leather, it provides ergonomic support for long working sessions.",
    image: "/images/demo/item2.png",
    price: "$850",
    specs: ["Ergonomic Design", "Solid Oak Frame", "Hand-stitched Leather", "3-Year Warranty"]
  },
  {
    id: "3",
    title: "Pro Headphones",
    description: "Experience silence like never before. Our proprietary noise-cancelling technology blocks 99% of ambient sound, while the 50mm drivers deliver crystalline audio.",
    image: "/images/demo/item3.png",
    price: "$399",
    specs: ["Active Noise Cancelling", "40h Battery Life", "USB-C Fast Charge", "Foldable Design"]
  },
];

const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const item = DEMO_ITEMS.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Item Not Found</h2>
        <button
          onClick={() => navigate("/demo/items")}
          className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-lg"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors group"
      >
        <svg
          className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Collection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="relative aspect-square overflow-hidden rounded-2xl">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            style={{
              // MATCHING view-transition-name to trigger the transition
              viewTransitionName: `item-image-${item.id}`,
            } as React.CSSProperties}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-brand-500 font-bold uppercase tracking-widest text-sm mb-2">
            Premium Artifact
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {item.title}
          </h1>
          <p className="text-3xl font-light text-brand-600 mb-6">
            {item.price}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {item.description}
          </p>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Specifications</h3>
            <ul className="grid grid-cols-1 gap-3">
              {item.specs.map((spec, i) => (
                <li key={i} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          <button className="mt-auto w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98]">
            Purchase Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
