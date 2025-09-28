import React, { useEffect, useState } from 'react'
import QuestionCard from '../components/QuestionCard'
import Timer from '../components/Timer'
import Button from '../components/Button'
import { PublicQuestion, Answer, submitAnswers } from '../api'

export default function QuizPage({ questions, email, onFinish } : { questions: PublicQuestion[], email:string, onFinish: (res:any)=>void }){
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [timeLeft, setTimeLeft] = useState<number>(questions.length * 30); // 30s per question

  useEffect(()=>{
    const interval = setInterval(()=>{
      setTimeLeft(prev => {
        if(prev <= 1){ clearInterval(interval); handleSubmit(); return 0; }
        return prev - 1;
      })
    }, 1000);
    return ()=> clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  function selectAnswer(qid:number, idx:number){
    setAnswers(prev => new Map(prev).set(qid, idx));
  }

  function goNext(){ if(index < questions.length-1) setIndex(index+1); }
  function goPrev(){ if(index > 0) setIndex(index-1); }

  async function handleSubmit(){
    const payload: Answer[] = questions.map(q => ({ questionId: q.id, selectedIndex: answers.get(q.id) ?? -1 }));
    try{
      const res = await submitAnswers(email, payload);
      onFinish(res);
    }catch(e:any){
      alert('Submit failed: ' + e.message);
    }
  }

  const q = questions[index];
  const selected = answers.get(q.id) ?? null;

  return (
    <div className="max-w-xl mx-auto mt-6">
      <Timer timeLeft={timeLeft} />
      <QuestionCard question={q} selected={selected} onSelect={(i)=>selectAnswer(q.id,i)} />
      <div className="flex justify-between mt-4">
        <Button onClick={goPrev} disabled={index===0}>Previous</Button>
        {index < questions.length-1 ? 
          <Button onClick={goNext}>Next</Button> :
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        }
      </div>
      <div className="mt-4 text-center text-gray-600">
        Question {index+1} of {questions.length}
      </div>
    </div>
  )
}
