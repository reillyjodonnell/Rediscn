import { RedisConnectionForm } from './redis-connection-form';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function UserNav() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <RedisConnectionForm />
      </DialogContent>
    </Dialog>
  );
}
