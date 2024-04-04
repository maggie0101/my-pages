import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useShop() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const buyShopItem = async ({ itemId }: { itemId: number }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/shop/item", {
        method: "POST",
        body: JSON.stringify({ itemId }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }
      router.refresh();
    } catch (error) {
      console.error("Error buying item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const buyShopPet = async ({ petId }: { petId: number }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/shop/pet", {
        method: "POST",
        body: JSON.stringify({ petId }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }
      router.refresh();
    } catch (error) {
      console.error("Error buying pet:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const buyShopPlant = async ({ plantId }: { plantId: number }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/shop/plant", {
        method: "POST",
        body: JSON.stringify({ plantId }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }
      router.refresh();
    } catch (error) {
      console.error("Error buying plant:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    buyShopItem,
    buyShopPet,
    buyShopPlant,
    loading,
  };
}
