import React from "react";
import { Link } from "react-router-dom";

const DEMO_ITEMS = [
  {
    id: "1",
    title: "Luxury Timepiece",
    description: "Elegant and precise engineering.",
    image: "/images/demo/item1.png",
    price: "$2,499",
  },
  {
    id: "2",
    title: "Designer Chair",
    description: "Minimalist comfort for your space.",
    image: "/images/demo/item2.png",
    price: "$850",
  },
  {
    id: "3",
    title: "Pro Headphones",
    description: "Immersive sound isolation.",
    image: "/images/demo/item3.png",
    price: "$399",
  },
];

const ItemListPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Premium Collection</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Experience smooth Shared Element Transitions between the list and details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DEMO_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={`/demo/items/${item.id}`}
            className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                style={{
                  // Unique view-transition-name for each image
                  viewTransitionName: `item-image-${item.id}`,
                } as React.CSSProperties}
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-brand-600">
                {item.price}
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">
                {item.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {item.description}
              </p>
              <div className="mt-4 flex items-center text-brand-500 font-medium text-sm">
                View Details
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ItemListPage;
