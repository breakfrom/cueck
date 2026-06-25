import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const baseQuestions = [
  {
    question: "¿Cuál es tu color favorito?",
    options: ["Rojo", "Rosado", "Violeta"],
    correctAnswer: "Rojo"
  },
  {
    question: "¿Con qué película nos conocimos?",
    options: ["Boulevard", "Michael Jackson", "Mario Bross"],
    correctAnswer: "Boulevard"
  },
  {
    question: "Todo lo mio es tuyo y si no es tuyo?",
    options: ["te lo presto", "me lo quedo", "mejor"],
    correctAnswer: "te lo presto"
  }
];

function shuffleItems(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createRandomQuiz() {
  return shuffleItems(baseQuestions).map((question) => {
    const options = shuffleItems(question.options);
    return {
      ...question,
      options,
      correct: options.indexOf(question.correctAnswer),
    };
  });
}

export default function Quiz({ onComplete, artDirection }) {
  const questions = useMemo(() => createRandomQuiz(), []);
  const [currentQ, setCurrentQ] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  const palette = artDirection?.palette || {};
  const fonts = artDirection?.fontPairings || {};

  const handleAnswer = (idx) => {
    setSelectedIdx(idx);
    
    if (idx === questions[currentQ].correct) {
      setIsCorrect(true);
      setTimeout(() => {
        if (currentQ < questions.length - 1) {
          setCurrentQ(prev => prev + 1);
          setIsCorrect(false);
          setSelectedIdx(null);
        } else {
          onComplete();
        }
      }, 800);
    } else {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setSelectedIdx(null);
      }, 600);
    }
  };

  const q = questions[currentQ];

  // Progress dots
  const dots = questions.map((_, i) => (
    <motion.div
      key={i}
      className="quiz-dot"
      style={{
        backgroundColor: i < currentQ ? (palette.primary || '#c9184a') : i === currentQ ? (palette.primary || '#c9184a') + '60' : (palette.muted || '#999') + '30',
        width: i === currentQ ? 24 : 8,
      }}
      layout
    />
  ));

  return (
    <div className="quiz-screen">
      {/* Ambient */}
      <div className="quiz-ambient">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${3 + Math.random() * 3}px`,
              height: `${3 + Math.random() * 3}px`,
              background: 'rgba(255,255,255,0.15)',
            }}
            animate={{
              y: [0, -(20 + Math.random() * 60)],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <div className="quiz-overlay">
        <motion.div
          className="quiz-card-premium"
          animate={isError ? { x: [-12, 14, -14, 12, -6, 6, 0] } : { x: 0 }}
          transition={isError ? { duration: 0.5, ease: 'easeInOut' } : {}}
          style={{
            borderColor: isError ? '#e63946' + '60' : isCorrect ? (palette.primary || '#c9184a') + '40' : 'rgba(255,255,255,0.15)',
            boxShadow: isError
              ? '0 0 40px rgba(230, 57, 70, 0.3)'
              : isCorrect
                ? `0 0 40px ${(palette.primary || '#c9184a')}30`
                : '0 8px 40px rgba(0,0,0,0.2)',
          }}
        >
          {/* Progress */}
          <div className="quiz-progress">{dots}</div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={`q-${currentQ}`}
              className="quiz-question"
              style={{ fontFamily: `'${fonts.title || 'Playfair Display'}', serif` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {q.question}
            </motion.h2>
          </AnimatePresence>

          {/* Options */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`opts-${currentQ}`}
              className="quiz-options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {q.options.map((opt, idx) => {
                let optionClass = 'quiz-option';
                if (selectedIdx === idx && isCorrect) optionClass += ' quiz-option-correct';
                if (selectedIdx === idx && isError) optionClass += ' quiz-option-wrong';

                return (
                  <motion.button
                    key={idx}
                    className={optionClass}
                    onClick={() => handleAnswer(idx)}
                    style={{
                      fontFamily: `'${fonts.body || 'Inter'}', sans-serif`,
                      '--option-accent': palette.primary || '#c9184a',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={selectedIdx !== null}
                  >
                    <span className="quiz-option-indicator">{String.fromCharCode(65 + idx)}</span>
                    {opt}
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Subtle hint */}
          <motion.p
            className="quiz-hint"
            style={{ fontFamily: `'${fonts.handwritten || 'Caveat'}', cursive` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2 }}
          >
            👌
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
