import { useQuery } from "@tanstack/react-query";
import type {
  Book,
  Film,
  FullMovie,
  FullTvShow,
  Game,
  Item,
  ItemStatus,
  User,
} from "../assets/lib/types";
import { createItem, deleteItem, fetchMyItems } from "../api/api";
import { ItemNormalizer } from "../assets/lib/utils";
import { useState } from "react";

/**
 * this hook will manage all connected methods for managing the user library, including all CRUD actions/operations.
 */

export default function useLibrary() {
  const [actionError, setActionError] = useState<string | null>(null);
  const lib = useQuery({
    queryKey: ["library"],
    queryFn: () => fetchMyItems(), // no need for category or status, filtering can happen client side with little to no latency to it
    enabled: true,
  });

  const library = lib.data ?? [];

  async function addToLibrary(
    raw: Book | Game | Film | FullMovie | FullTvShow,
    status: ItemStatus,
  ): Promise<boolean> {
    const item = ItemNormalizer(raw, status);
    console.log(item);
    try {
      const res = await createItem({ item });

      return res && true;
    } catch (error) {
      console.error(error);
      setActionError((error as Error).message);
      return false;
    }
  }

  async function removeItem(id: Item["externalId"]): Promise<boolean> {
    try {
      const res = await deleteItem(id);
      if (!res.success) throw new Error(res.error ?? "");
      return res.success;
    } catch (error) {
      // fail silently
      console.error((error as Error).message);
      setActionError((error as Error).message);
      return false;
    }
  }

  function isInLibrary(title: string, id: Item["externalId"]): boolean {
    const isInLibrary = library.find(
      (lib_item) => lib_item.title === title && lib_item.externalId === id,
    );

    return isInLibrary ? true : false;
  }

  return {
    library,
    isPending: lib.isPending,
    isLoading: lib.isLoading,
    addToLibrary,
    removeItem,
    isInLibrary,
    actionError,
  };
}
