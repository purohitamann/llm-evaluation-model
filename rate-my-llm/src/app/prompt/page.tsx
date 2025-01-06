'use client'

import { useState } from 'react'
import axios from 'axios'

export default function Home() {
    const [systemPrompt, setSystemPrompt] = useState('')
    const [userPrompt, setUserPrompt] = useState('')
    const [response, setResponse] = useState('')
    const [scores, setScores] = useState<{ bleu?: number, rouge?: number }>({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleEvaluate = async () => {
        setLoading(true)
        setError(null)
        setResponse('')
        setScores({})
        try {
            const res = await axios.post('/api/evaluate', {
                systemPrompt,
                userPrompt
            })
            const data = res.data
            setResponse(data.response)
            setScores({ bleu: data.bleu, rouge: data.rouge })
        } catch (err: any) {
            console.error('Evaluation error:', err)
            setError(err.response?.data?.error || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">LLM Evaluation Platform</h1>

            <div className="mb-4">
                <label className="block font-semibold mb-1">System Prompt:</label>
                <textarea
                    className="border p-2 w-full rounded"
                    rows={2}
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">User Prompt:</label>
                <textarea
                    className="border p-2 w-full rounded"
                    rows={2}
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                />
            </div>

            <button
                onClick={handleEvaluate}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Evaluating...' : 'Evaluate'}
            </button>

            {error && (
                <p className="text-red-600 mt-4">{error}</p>
            )}

            {response && (
                <section className="mt-6 p-4 border rounded bg-gray-50">
                    <h2 className="text-xl font-semibold mb-2">LLM Response</h2>
                    <p className="mb-4">{response}</p>
                    <div className="mt-2">
                        <h3 className="font-semibold">Metrics</h3>
                        <p>BLEU: {scores.bleu}</p>
                        <p>ROUGE: {scores.rouge}</p>
                    </div>
                </section>
            )}
        </main>
    )
}
