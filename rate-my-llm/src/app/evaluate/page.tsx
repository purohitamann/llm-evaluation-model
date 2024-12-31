"use client"

import { useState } from "react"
import StarRating from "@/components/StarRating"
export default function Home() {
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState("")
    const [rating, setRating] = useState<number | null>(null)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleGenerate() {
        setLoading(true)
        setSuccess(false)
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            })
            const data = await res.json()
            if (data.response) {
                setResponse(data.response)
            }
        } catch (error) {
            console.error(error)
            alert("Error generating response")
        } finally {
            setLoading(false)
        }
    }

    async function handleEvaluate() {
        if (rating === null) {
            alert("Please provide a rating before submitting.")
            return
        }

        try {
            const res = await fetch("/api/evaluations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, response, rating, comment }),
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess(true)
                // Reset feedback form
                setRating(null)
                setComment("")
            } else {
                console.error(data.error)
                alert("Error saving evaluation")
            }
        } catch (error) {
            console.error(error)
            alert("Error saving evaluation")
        }
    }

    return (
        <main className="p-4">
            <h1>Rate My LLM</h1>

            <div className="mt-4">
                <textarea
                    placeholder="Enter your prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="border p-2 w-full"
                />
            </div>

            <button className="btn mt-2" onClick={handleGenerate} disabled={loading}>
                {loading ? "Generating..." : "Generate"}
            </button>

            {response && (
                <>
                    <div className="mt-4 bg-gray-100 p-4">
                        <h3>Response:</h3>
                        <p>{response}</p>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="rating">Rate this response (1-5): </label>
                        <input
                            type="number"
                            id="rating"
                            min="1"
                            max="5"
                            value={rating ?? ""}
                            onChange={(e) => setRating(parseInt(e.target.value))}
                            className="border p-1 ml-2"
                        />
                    </div>

                    <div className="mt-2">
                        <label htmlFor="comment">Additional Feedback (optional):</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={2}
                            className="border p-1 w-full"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="rating">Rate this response: </label>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>


                    <button className="btn mt-2" onClick={handleEvaluate}>
                        Submit Rating
                    </button>

                    {success && <p className="text-green-500 mt-2">Evaluation submitted successfully!</p>}
                </>
            )}
        </main>
    )
}
