import React from 'react'
import Card from '../components/Card'
import Button from '../components/Button'

export default function Result({ result, onRestart }: { result:any, onRestart: ()=>void }){
  if(!result) return null;

  return (
    <div className="max-w-xl mx-auto mt-6 text-center">
      <Card>
        <h2 className="text-2xl font-bold mb-4">Your score: {result.score} / {result.total}</h2>

        {result.details && (
          <div className="space-y-2">
            {result.details.map((d:any) => (
              <div key={d.questionId} className={`p-2 rounded ${d.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Q{d.questionId}: {d.correct ? '✔️ Correct' : `❌ Wrong (You: ${d.selectedIndex}, Answer: ${d.correctIndex})`}
              </div>
            ))}
          </div>
        )}

        <Button onClick={onRestart} className="mt-4">Restart Quiz</Button>
      </Card>
    </div>
  )
}
