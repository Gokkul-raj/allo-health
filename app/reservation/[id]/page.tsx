"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

export default function ReservationPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [reservation, setReservation] =
    useState<any>(null);

  const [timeLeft, setTimeLeft] =
    useState("");

  async function fetchReservation() {
    const response = await axios.get(
      `/api/reservations/${id}`
    );

    setReservation(response.data);
  }

  useEffect(() => {
    fetchReservation();
  }, []);

  useEffect(() => {
    if (!reservation) return;

    const interval = setInterval(() => {
      const expiry = new Date(
        reservation.expiresAt
      ).getTime();

      const now = new Date().getTime();

      const difference =
        expiry - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(
        difference /
          1000 /
          60
      );

      const seconds = Math.floor(
        (difference / 1000) %
          60
      );

      setTimeLeft(
        `${minutes}m ${seconds}s`
      );
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [reservation]);

  async function confirmReservation() {
  try {
    await axios.post(
      `/api/reservations/${id}/confirm`
    );

    alert(
      "Reservation confirmed!"
    );

    router.push("/");
  } catch (error: any) {
    if (error.response?.status === 410) {
      alert("Reservation expired");
    } else {
      alert("Confirmation failed");
    }
  }
}

  async function cancelReservation() {
  try {
    await axios.post(
      `/api/reservations/${id}/release`
    );

    alert(
      "Reservation cancelled!"
    );

    router.push("/");
  } catch {
    alert(
      "Cancellation failed"
    );
  }
}

  if (!reservation) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">
          Reservation Checkout
        </h1>

        <p>
          Product:
          {" "}
          {
            reservation.inventory
              .product.name
          }
        </p>

        <p>
          Warehouse:
          {" "}
          {
            reservation.inventory
              .warehouse.name
          }
        </p>

        <p>
          Quantity:
          {" "}
          {
            reservation.quantity
          }
        </p>

        <p>
          Status:
          {" "}
          {
            reservation.status
          }
        </p>

        <p className="text-red-600 font-bold">
          Time Remaining:
          {" "}
          {timeLeft}
        </p>

        {reservation.status ===
          "PENDING" && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={
                confirmReservation
              }
              className="bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              Confirm
            </button>

            <button
              onClick={
                cancelReservation
              }
              className="bg-red-600 text-white px-5 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </main>
  );
}