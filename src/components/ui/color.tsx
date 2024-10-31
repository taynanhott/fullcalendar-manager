interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function ColorSelector({ value, onChange }: Props) {

    return (
        <div className="flex items-center space-x-2">
            <div className="relative">
                <input
                    type="color"
                    id="colorPicker"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer"
                />
                <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ backgroundColor: value }}
                ></div>
            </div>
            <span className="text-sm text-gray-500">{value}</span>
        </div>
    )
}