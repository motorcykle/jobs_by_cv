import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "next-auth"
import { Button } from "./ui/button"
import { signOut } from "next-auth/react"


export default function Dropdown ({ user }: { user: Partial<User> }) {
  
  return <DropdownMenu>
    <DropdownMenuTrigger>
      <Avatar>
        <AvatarImage src={user.image!} />
        <AvatarFallback>{user.name?.split(" ").map(name => name[0]).join("")}</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>{user.name}</DropdownMenuItem>
      <DropdownMenuItem>Billing</DropdownMenuItem>
      <DropdownMenuItem>
        <Button className="w-full" onClick={() => signOut({ callbackUrl: "/"})}>Log out</Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}