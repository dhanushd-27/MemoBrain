"use client";

import { Button, IconButton } from "@repo/ui";
import { Mail, Plus, Trash2, Loader2, ArrowRight } from "lucide-react";

export default function ButtonsPage() {
  return (
    <div className="flex min-h-screen flex-col gap-8 bg-white p-10 text-zinc-900">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Button Component</h1>
        <p className="text-zinc-500">
          Visual test suite for Button and IconButton components.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Standard Buttons</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Contained */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-zinc-500">Contained</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="contained">Default</Button>
              <Button variant="contained" icon={Mail}>
                With Icon
              </Button>
              <Button variant="contained" isLoading>
                Loading
              </Button>
              <Button variant="contained" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Outlined */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-zinc-500">Outlined</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outlined">Default</Button>
              <Button variant="outlined" icon={Plus}>
                With Icon
              </Button>
              <Button variant="outlined" isLoading>
                Loading
              </Button>
              <Button variant="outlined" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Texted */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-zinc-500">Texted</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="texted">Default</Button>
              <Button variant="texted" icon={ArrowRight}>
                With Icon
              </Button>
              <Button variant="texted" isLoading>
                Loading
              </Button>
              <Button variant="texted" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Icon Buttons</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Contained */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-zinc-500">Contained</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <IconButton variant="contained" icon={Plus} />
              <IconButton variant="contained" icon={Trash2} size="sm" />
              <IconButton variant="contained" icon={Mail} size="lg" />
              <IconButton variant="contained" icon={Plus} disabled />
              <IconButton variant="contained" icon={Loader2} isLoading />
            </div>
          </div>

          {/* Outlined */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-zinc-500">Outlined</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <IconButton variant="outlined" icon={Plus} />
              <IconButton variant="outlined" icon={Trash2} size="sm" />
              <IconButton variant="outlined" icon={Mail} size="lg" />
              <IconButton variant="outlined" icon={Plus} disabled />
              <IconButton variant="outlined" icon={Loader2} isLoading />
            </div>
          </div>

          {/* Texted */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-zinc-500">Texted</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <IconButton variant="texted" icon={Plus} />
              <IconButton variant="texted" icon={Trash2} size="sm" />
              <IconButton variant="texted" icon={Mail} size="lg" />
              <IconButton variant="texted" icon={Plus} disabled />
              <IconButton variant="texted" icon={Loader2} isLoading />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
