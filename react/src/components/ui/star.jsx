import { useState } from 'react'
import { Star } from 'lucide-react'

export default function PrioritySelector({ className, width = 8, height = 8, variant = "view" }) {
    const [priority, setPriority] = useState(1)

    return (
        <div className={`${className} flex flex-col space-y-2`}>
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    variant == "form" ? (
                        <button
                            key={star}
                            onClick={() => setPriority(star)}
                            className="focus:outline-none"
                        >
                            <Star
                                className={`w-${width} h-${height} ${star <= priority ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                    } hover:text-yellow-400 transition-colors duration-200`}
                            />
                        </button>) : (
                        <Star
                            className={`w-${width} h-${height} ${star <= priority ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                } transition-colors duration-200`}
                        />
                    )
                ))}
            </div>
        </div>
    )
}