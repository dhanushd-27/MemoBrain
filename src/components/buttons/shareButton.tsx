"use client"

import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { shareBrain } from "@/actions/put/share-brain"
import { isErrorResponse } from "@/utils/api/api-response-handler"
import { toast } from "sonner"

export function Share() {
  const [url, setUrl] = useState<string>("")

  async function handleShare() {
    try {
      const response = await shareBrain()

      if (isErrorResponse(response)) {
        toast.error("Invalid Session")
        return
      }

      const { brainUrl } = response.data as { brainUrl: string }
      setUrl(brainUrl)
    } catch (err) {
      toast.error("Something went wrong")
      console.error(err)
    }
  }

  function handleCopy() {
    if (!url) return
    navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard!")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Here&apos;s your brain link
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              value={url}
              placeholder="Share Url Link"
              readOnly
            />
          </div>
          <Button type="button" size="sm" className="px-3" onClick={handleCopy} disabled={!url}>
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button onClick={handleShare}>
            Share
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
