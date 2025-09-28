import React from 'react';

export default function Timer({ timeLeft }: { timeLeft:number }) {
  return <div className="text-right text-sm text-gray-600 mb-2">Time left: {timeLeft}s</div>;
}
