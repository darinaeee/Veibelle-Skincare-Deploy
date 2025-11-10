// src/context/QuizProgressContext.jsx
import React, { createContext, useContext, useState } from "react";

const QuizProgressContext = createContext();

export const QuizProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(0); // percentage (0–100)
  const [currentStep, setCurrentStep] = useState(1);

  const updateProgress = (step, totalSteps = 6) => {
    setCurrentStep(step);
    const percent = Math.round((step / totalSteps) * 100);
    setProgress(percent);
    localStorage.setItem("quizStep", step.toString());
  };

  return (
    <QuizProgressContext.Provider value={{ progress, currentStep, updateProgress }}>
      {children}
    </QuizProgressContext.Provider>
  );
};

export const useQuizProgress = () => useContext(QuizProgressContext);
