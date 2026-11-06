import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  imageUrl?: string | null;
  className?: string;
}

export default function UserAvatar({
  name,
  imageUrl,
  className,
}: UserAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "U";

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name}
        width={96}
        height={96}
        className={cn("shrink-0 object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 select-none items-center justify-center font-bold",
        className,
      )}
    >
      {initial}
    </div>
  );
}
