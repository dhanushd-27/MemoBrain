import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import type { Slice, Memo } from "@repo/types";
import { getSlice, getSliceBrains } from "../services/slice.service";

export const useSliceData = () => {
  const params = useParams();
  const [slice, setSlice] = useState<Slice | null>(null);
  const [brains, setBrains] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!params.id) return;

    const idString = params.id;
    const hash = Array.isArray(idString) ? idString[0] : idString;

    if (!hash) return;

    let sliceId;
    try {
      sliceId = atob(hash);
    } catch {
      setError("Invalid slice ID");
      setLoading(false);
      return;
    }

    try {
      const [sliceRes, brainsRes] = await Promise.all([
        getSlice(sliceId),
        getSliceBrains(sliceId),
      ]);

      if (!sliceRes.slice) {
        setError("Slice not found");
      } else {
        setSlice(sliceRes.slice);
        setBrains(brainsRes.brains);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load slice data");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [fetchData, params.id]);

  return { slice, brains, loading, error, refresh: fetchData };
};
