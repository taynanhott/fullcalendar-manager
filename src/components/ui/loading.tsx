interface Props {
    active: boolean;
}

export default function Loading({ active }: Props) {
    return (
        <div className={`loader-container ${active ? "flex" : "hidden"}`}>
            <span className="loader"></span>
        </div>
    );
}