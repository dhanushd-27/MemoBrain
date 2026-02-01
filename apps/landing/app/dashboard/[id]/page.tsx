"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getSlice,
  getSliceBrains,
  type SliceResponse,
  type SliceBrainsResponse,
} from "../../../services/slice.service";
import type { Slice, Memo } from "@repo/types";
import { TbLoader, TbBrain, TbPlus } from "react-icons/tb";
import { Button, cn } from "@repo/ui";

export default function SliceDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const [slice, setSlice] = useState<Slice | null>(null);
  const [brains, setBrains] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hash = params.id as string;
        // Decode the slug (simple base64 decode for now)
        let sliceId;
        try {
          sliceId = atob(hash);
        } catch (e) {
          setError("Invalid slice ID");
          setLoading(false);
          return;
        }

        const [sliceRes, brainsRes] = await Promise.all([
          getSlice(sliceId),
          getSliceBrains(sliceId),
        ]);

        setSlice(sliceRes.slice);
        setBrains(brainsRes.brains);
      } catch (err) {
        console.error("Failed to fetch slice data", err);
        setError(
          "Failed to load slice. It might not exist or you don't have access.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <TbLoader className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (error || !slice) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="text-xl font-semibold text-danger">
          {error || "Slice not found"}
        </div>
        <Button variant="outlined" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-serif mb-2">{slice.name}</h1>
        {slice.description && (
          <p className="text-muted-foreground">{slice.description}</p>
        )}
      </header>

      <div className="h-px bg-border w-full mb-8" />

      {brains.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-6 text-center">
          <div className="bg-muted p-6 rounded-full">
            <TbBrain className="text-6xl text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">No brains yet</h3>
            <p className="text-muted-foreground max-w-sm">
              This slice is empty. Create your first brain (memo) to start
              organizing your thoughts.
            </p>
          </div>
          <Button variant="contained" className="rounded-full px-8">
            <TbPlus className="mr-2 text-xl" />
            Create New Brain
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brains.map((brain) => (
            <div
              key={brain.id}
              className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <TbBrain className="text-xl" />
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                  {brain.type}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 line-clamp-1">
                {brain.title || "Untitled Brain"}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {/* Add Content */}
                {/* {brain.content} */}
              </p>
              <div className="text-xs text-muted-foreground pt-4 border-t mt-auto">
                Created {new Date(brain.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
