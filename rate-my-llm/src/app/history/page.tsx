"use client"

import { useEffect, useState } from "react"
import { Chart } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Evaluation {
    id: number
    prompt: string
    response: string
    rating: number
    comment: string | null
    createdAt: string
    updatedAt: string
}

export default function EvaluationsPage() {
    const [evaluations, setEvaluations] = useState<Evaluation[]>([])
    const [averageRating, setAverageRating] = useState<number>(0)
    const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0])

    useEffect(() => {
        async function fetchEvaluations() {
            try {
                const res = await fetch("/api/evaluations")
                const data = await res.json()
                setEvaluations(data)

                // Calculate average rating
                const avg = data.reduce((acc: number, curr: Evaluation) => acc + curr.rating, 0) / data.length || 0
                setAverageRating(avg.toFixed(2))

                // Calculate rating distribution
                const distribution = [0, 0, 0, 0, 0]
                data.forEach((evalItem: Evaluation) => {
                    if (evalItem.rating >= 1 && evalItem.rating <= 5) {
                        distribution[evalItem.rating - 1] += 1
                    }
                })
                setRatingDistribution(distribution)
            } catch (error) {
                console.error("Error fetching evaluations:", error)
            }
        }
        fetchEvaluations()
    }, [])

    const barData = {
        labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
        datasets: [
            {
                label: "Number of Ratings",
                data: ratingDistribution,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    }

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Rating Distribution',
            },
        },
    }

    return (
        <main className="p-4">
            <h1>LLM Evaluations Dashboard</h1>

            <div className="mt-4">
                <h2>Average Rating: {averageRating} / 5</h2>
            </div>

            <div className="mt-4">
                <Chart type="bar" data={barData} options={barOptions} />
            </div>

            <div className="mt-6">
                <h2>All Evaluations</h2>
                {evaluations.map((evalItem) => (
                    <div key={evalItem.id} className="border p-2 mt-2">
                        <p><strong>Prompt:</strong> {evalItem.prompt}</p>
                        <p><strong>Response:</strong> {evalItem.response}</p>
                        <p><strong>Rating:</strong> {evalItem.rating} / 5</p>
                        {evalItem.comment && <p><strong>Comment:</strong> {evalItem.comment}</p>}
                        <p><small>Submitted on: {new Date(evalItem.createdAt).toLocaleString()}</small></p>
                    </div>
                ))}
            </div>
        </main>
    )
}
