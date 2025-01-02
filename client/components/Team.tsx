import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Team {
  name: string;
  role: string;
  avatarUrl: string;
}

export function Team({ name, role, avatarUrl }: Team) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  )
}

