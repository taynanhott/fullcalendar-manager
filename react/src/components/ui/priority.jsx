import { useState } from 'react'

export default function PrioritySelector({ className, width = 6, height = 6, variant = "form" }) {
    const [selected, setSelected] = useState(4)

    const getColor = (index) => {
        if (index >= selected) return 'bg-gray-200'

        const colors = [
            'bg-green-500',
            'bg-green-400',
            'bg-yellow-400',
            'bg-orange-400',
            'bg-red-500'
        ]

        return colors[index]
    }

    return (
        <div className={`${className} flex flex-col space-y-4`}>
            <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        disabled={variant === "view" ? true : false}
                        key={num}
                        className={`w-${width} h-${height} rounded-full transition-colors duration-200 ${getColor(num - 1)}`}
                        onClick={() => setSelected(num)}
                        aria-label={`Prioridade ${num}`}
                    />
                ))}
            </div>
        </div>
    )
}