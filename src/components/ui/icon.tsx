import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

interface Props {
    source?: string
}

export function Icon({ source = "https://github.com/shadcn.png" }: Props) {
    return (
        <Avatar>
            <AvatarImage src={source} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    )
}