"use client";

import { useState, useCallback, useEffect } from "react";
import styled from "@emotion/styled";

// Styled Components
const GameContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 0;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const ScoreDisplay = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 40px;
  border-radius: 20px;
  font-size: 32px;
  font-weight: bold;
  color: #4ecca3;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: block;
  text-align: center;
  width: fit-content;
  border: 3px solid #4ecca3;
  backdrop-filter: blur(10px);
  position: fixed;
  top: 30px;
  left: 30px;
  z-index: 1000;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
`;

const GameContent = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProgressContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
`;

const LevelButton = styled.button<{ isActive: boolean; isUnlocked: boolean }>`
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.isActive ? "#4ecca3" : props.isUnlocked ? "#2c3e50" : "#34495e"};
  color: white;
  border: none;
  opacity: ${(props) => (props.isUnlocked ? 1 : 0.5)};
  pointer-events: ${(props) => (props.isUnlocked ? "auto" : "none")};

  &:hover {
    transform: ${(props) => (props.isUnlocked ? "translateY(-2px)" : "none")};
    box-shadow: ${(props) =>
      props.isUnlocked ? "0 5px 15px rgba(0,0,0,0.3)" : "none"};
  }
`;

const QuestionContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  text-align: center;
`;

const AnswerInput = styled.input`
  padding: 15px;
  font-size: 24px;
  border-radius: 10px;
  border: 2px solid #4ecca3;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 200px;
  text-align: center;
  margin: 20px 0;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px #4ecca3;
  }
`;

const Button = styled.button`
  padding: 15px 30px;
  font-size: 18px;
  border-radius: 10px;
  border: none;
  background: #4ecca3;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface MathsGameProps {
  onScoreChange?: (score: number) => void;
}

const MathsGame = ({ onScoreChange }: MathsGameProps) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState([0]);
  const [score, setScore] = useState(1000);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const generateQuestion = useCallback(() => {
    let num1: number, num2: number, operator: string;
    switch (currentLevel) {
      case 0: // Level 1: Addition and Subtraction
        num1 = Math.floor(Math.random() * 100);
        num2 = Math.floor(Math.random() * 100);
        operator = Math.random() < 0.5 ? "+" : "-";
        setQuestion(`${num1} ${operator} ${num2}`);
        setCorrectAnswer(operator === "+" ? num1 + num2 : num1 - num2);
        break;
      case 1: // Level 2: Multiplication
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        setQuestion(`${num1} × ${num2}`);
        setCorrectAnswer(num1 * num2);
        break;
      case 2: // Level 3: Division
        num2 = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * (Math.floor(Math.random() * 12) + 1);
        setQuestion(`${num1} ÷ ${num2}`);
        setCorrectAnswer(num1 / num2);
        break;
    }
    setAnswer("");
    setFeedback("");
  }, [currentLevel]);

  const handleSubmit = () => {
    const userAnswer = parseFloat(answer);
    if (userAnswer === correctAnswer) {
      const scoreIncrease = 100;
      setScore((prev) => prev + scoreIncrease);
      onScoreChange?.(scoreIncrease);
      setFeedback("Correct! 🎉");

      if (currentLevel < 2 && !unlockedLevels.includes(currentLevel + 1)) {
        setUnlockedLevels((prev) => [...prev, currentLevel + 1]);
      }

      setTimeout(generateQuestion, 1500);
    } else {
      const scorePenalty = -50;
      setScore((prev) => prev + scorePenalty);
      onScoreChange?.(scorePenalty);
      setFeedback("Try again! 😕");
    }
  };

  const handleLevelSelect = (level: number) => {
    if (unlockedLevels.includes(level)) {
      setCurrentLevel(level);
      generateQuestion();
    }
  };

  // Initialize first question
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  return (
    <GameContainer>
      <ScoreDisplay>Score: {score}</ScoreDisplay>

      <GameContent>
        <ProgressContainer>
          {[0, 1, 2].map((level) => (
            <LevelButton
              key={level}
              isActive={currentLevel === level}
              isUnlocked={unlockedLevels.includes(level)}
              onClick={() => handleLevelSelect(level)}
            >
              Level {level + 1}
            </LevelButton>
          ))}
        </ProgressContainer>

        <QuestionContainer>
          <h2>Level {currentLevel + 1}</h2>
          <h1 style={{ fontSize: "48px", margin: "20px 0" }}>{question}</h1>
          <AnswerInput
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
          />
          <div>
            <Button onClick={handleSubmit}>Submit</Button>
            <Button onClick={generateQuestion}>New Question</Button>
          </div>
          {feedback && (
            <p style={{ fontSize: "24px", marginTop: "20px" }}>{feedback}</p>
          )}
        </QuestionContainer>
      </GameContent>
    </GameContainer>
  );
};

export default MathsGame;
