// components/StarRating.tsx

import { useState } from "react"

interface StarRatingProps {
    rating: number | null
    setRating: (rating: number) => void
}

export default function StarRating({ rating, setRating }: StarRatingProps) {
    const [hover, setHover] = useState<number | null>(null)

    return (
        <div>
            {[...Array(5)].map((star, index) => {
                index += 1
                return (
                    <button
                        type="button"
                        key={index}
                        className={index <= (hover || rating || 0) ? "text-yellow-500" : "text-gray-300"}
                        onClick={() => setRating(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(null)}
                    >
                        <span className="text-2xl">&#9733;</span>
                    </button>
                )
            })}
        </div>
    )
}
