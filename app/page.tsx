"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Product = {
  id: string;
  name: string;
  description: string;
  stock: {
    warehouseId: string;
    warehouseName: string;
    availableStock: number;
  }[];
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function reserveProduct(
    productId: string,
    warehouseId: string
  ) {
    try {
      const response = await axios.post(
        "/api/reservations",
        {
          productId,
          warehouseId,
          quantity: 1,
        }
      );

      // Redirect to reservation page
      window.location.href =
        `/reservation/${response.data.id}`;

    } catch (error: any) {
      if (error.response?.status === 409) {
        alert("Not enough stock available");
      } else {
        alert("Reservation failed");
      }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        <h1 className="text-2xl font-semibold">
          Loading...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100 text-black">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Inventory Reservation System
      </h1>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg p-6 border"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              {product.name}
            </h2>

            <p className="text-gray-600 mb-4">
              {product.description}
            </p>

            <div className="space-y-4">
              {product.stock.map((stock) => (
                <div
                  key={stock.warehouseId}
                  className="border rounded-xl p-4 flex justify-between items-center bg-gray-50"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {stock.warehouseName}
                    </p>

                    <p className="text-gray-700">
                      Available Stock:{" "}
                      <span className="font-bold">
                        {stock.availableStock}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      reserveProduct(
                        product.id,
                        stock.warehouseId
                      )
                    }
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Reserve
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}