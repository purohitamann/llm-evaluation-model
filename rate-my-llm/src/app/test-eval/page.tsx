// pages/index.tsx
'use client'
import { useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [systemPrompt, setSystemPrompt] = useState('');
    const [userInput, setUserInput] = useState('');
    const [modelResponse, setModelResponse] = useState('');
    const [score, setScore] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleEvaluate = async () => {

        if (!systemPrompt || !userInput || !modelResponse) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);
        setError(null);
        setScore(null);
        try {
            const response = await axios.post('http://localhost:8000/evaluate', { // Use 'localhost' if preferred
                system_prompt: systemPrompt,
                user_input: userInput,
                model_response: modelResponse,
            });
            setScore(response.data.score);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>LLM Evaluation Model</h1>
            <div style={{ marginBottom: '1rem' }}>
                <label>System Prompt:</label>
                <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={3}
                    style={{ width: '100%' }}
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>User Input:</label>
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={3}
                    style={{ width: '100%' }}
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Model Response:</label>
                <textarea
                    value={modelResponse}
                    onChange={(e) => setModelResponse(e.target.value)}
                    rows={3}
                    style={{ width: '100%' }}
                />
            </div>
            <button onClick={handleEvaluate} disabled={loading}>
                {loading ? 'Evaluating...' : 'Evaluate'}
            </button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {score && (
                <div style={{ marginTop: '2rem' }}>
                    <h2>Evaluation Scores:</h2>
                    <pre>{JSON.stringify(score, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Home;
