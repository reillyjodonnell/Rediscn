import { PlusIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Form } from '@remix-run/react';
import { PresetSelector } from './preset-selector';
import { presets } from '~/data/redis-preset';
import { toast } from 'sonner';
import { RedisCreator } from './redis-creator';

export function CreateButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusIcon className="h-4 w-4" />
          <div className="mx-1" />
          <span>Add New</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Create entry</DialogTitle>
          <DialogDescription>
            This will add your entry to the redis database
          </DialogDescription>
        </DialogHeader>
        <RedisCreator />
      </DialogContent>
    </Dialog>
  );
}
