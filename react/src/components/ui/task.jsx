import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardListIcon, Clock, FlagIcon, FolderIcon } from "lucide-react"

export default function TaskCard(
    {
        name = "Complete project proposal",
        priority = "Medium",
        category = "Work",
        subcategory = "1h",
        variant = "list",
        className = ""
    }
) {
    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'low':
                return 'bg-green-500'
            case 'medium':
                return 'bg-yellow-500'
            case 'high':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }

    const getVariant = (variant) => {
        switch (variant.toLowerCase()) {
            case 'list':
                return ''
            case 'selected':
                return 'hidden'
            default:
                return ''
        }
    }

    return (
        <Card className={`w-full rounded-[16px] mb-2 bg-white cursor-pointer ${className}`}>
            <CardHeader className="py-2">
                <CardTitle className="flex flex-col md:flex-col lg:flex-row items-center gap-2">
                    <ClipboardListIcon className="h-5 w-5 hidden lg:flex text-dark-task" />
                    <span className="text-base text-dark-task">{name}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2">
                    <div className={`flex items-center gap-2 ${getVariant(variant)}`}>
                        <FlagIcon className="h-4 w-4 text-dark-task" />
                        <span className="text-sm font-medium text-dark-task">Priority:</span>
                        <Badge variant="secondary" className={`${getPriorityColor(priority)} text-white`}>
                            {priority}
                        </Badge>
                    </div>
                    <div className={`flex items-center gap-2 ${getVariant(variant)}`}>
                        <FolderIcon className="h-4 w-4 text-dark-task" />
                        <span className="text-sm font-medium text-dark-task">Category:</span>
                        <span className="text-sm">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-dark-task" />
                        <span className="text-sm font-medium text-dark-task">Duration:</span>
                        <span className="text-sm">{subcategory}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}