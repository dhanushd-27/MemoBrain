import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateBrain() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Brain</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Brain</DialogTitle>
          <DialogDescription>
            Create brain and store important information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-right">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input id="name" placeholder="Enter your brain title" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
                Type
            </Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Brain Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="links">Links</SelectItem>
                <SelectItem value="tweet">Tweet</SelectItem>
                <SelectItem value="docs">Document</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Link
            </Label>
            <Input id="name" placeholder="Enter Link" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tag
            </Label>
            <Input id="name" placeholder="Enter Tag Value" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save Brain</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}