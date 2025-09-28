import React from 'react'
import Card from './Card'

export default function QuestionCard({ question, selected, onSelect }:
  { question: { id:number; text:string; options:string[] }, selected: number | null, onSelect: (i:number)=>void }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">{question.text}</h3>
      <ul className="space-y-2">
        {question.options.map((opt, i) => (
          <li key={i}>
            <label className={`flex items-center gap-2 p-2 rounded-md cursor-pointer 
              ${selected===i ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
              <input type="radio" name={`q-${question.id}`} checked={selected===i} onChange={()=>onSelect(i)} />
              {opt}
            </label>
          </li>
        ))}
      </ul>
    </Card>
  )
}
