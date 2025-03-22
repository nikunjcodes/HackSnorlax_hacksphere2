"use client";
import React, { useState } from "react";
import Link from "next/link";

// Interfaces for App Component
interface Subject {
  id: "physics" | "chemistry" | "maths";
  title: string;
  description: string;
  topics: string[];
}

interface SelectedTopic {
  subject: Subject["id"];
  topic: string;
}

// Interfaces for Topic Components
interface TopicProps {
  onBack: () => void;
}

interface VisibleSolutions {
  [key: string]: boolean;
}

interface TrajectoryState {
  isRunning: boolean;
  angle: number;
  velocity: number;
  height: number;
}

interface RangeCalculatorInput {
  velocity: string;
  angle: string;
  height: string;
}

interface RangeCalculatorState {
  input: RangeCalculatorInput;
  result: string | null;
}

interface TimeOfFlightState {
  isPlaying: boolean;
  speed: number;
  currentTime: number;
}

interface SimulationStates {
  trajectory: TrajectoryState;
  rangeCalculator: RangeCalculatorState;
  timeOfFlight: TimeOfFlightState;
}

// RedoxReaction Component
const RedoxReaction: React.FC<TopicProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string>("concepts");
  const [visibleSolutions, setVisibleSolutions] = useState<VisibleSolutions>(
    {}
  );

  const toggleSolution = (problemId: string): void => {
    setVisibleSolutions((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "concepts":
        return (
          <div className="section">
            <h2>Key Concepts</h2>
            <div className="concept-card">
              <h3 className="text-lg font-semibold mb-2">
                What is a Redox Reaction?
              </h3>
              <p>
                A redox reaction (reduction-oxidation) involves the transfer of
                electrons between species. One species loses electrons
                (oxidation) while another gains electrons (reduction).
              </p>
            </div>
            <div className="concept-card">
              <h3 className="text-lg font-semibold mb-2">Oxidation</h3>
              <p>
                Oxidation is the loss of electrons by a molecule, atom, or ion.
                When a species is oxidized, its oxidation number increases.
              </p>
            </div>
            <div className="concept-card">
              <h3 className="text-lg font-semibold mb-2">Reduction</h3>
              <p>
                Reduction is the gain of electrons by a molecule, atom, or ion.
                When a species is reduced, its oxidation number decreases.
              </p>
            </div>
          </div>
        );

      case "formulas":
        return (
          <div className="section">
            <h2>Important Formulas and Rules</h2>
            <div className="formula-card">
              <h3 className="text-lg font-semibold mb-2">
                Oxidation Number Rules
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>The oxidation number of a free element is always 0</li>
                <li>
                  The oxidation number of a monatomic ion equals its charge
                </li>
                <li>The sum of oxidation numbers in a neutral compound is 0</li>
                <li>Group 1 metals always have an oxidation number of +1</li>
                <li>Group 2 metals always have an oxidation number of +2</li>
              </ul>
            </div>
            <div className="formula-card">
              <h3 className="text-lg font-semibold mb-2">
                Half-Reaction Method
              </h3>
              <p>
                To balance redox equations: 1. Split the reaction into oxidation
                and reduction half-reactions 2. Balance atoms other than O and H
                3. Balance O using H2O 4. Balance H using H+ 5. Balance charge
                using electrons 6. Multiply half-reactions to equalize electrons
                7. Add half-reactions
              </p>
            </div>
          </div>
        );

      case "practice":
        return (
          <div className="section">
            <h2>Practice Problems</h2>
            <div className="practice-problem">
              <p className="font-semibold">Problem 1:</p>
              <p>Determine the oxidation numbers of each element in H2SO4.</p>
              <button onClick={() => toggleSolution("problem1")}>
                {visibleSolutions.problem1 ? "Hide Solution" : "Show Solution"}
              </button>
              <div
                className={`solution ${
                  visibleSolutions.problem1 ? "visible" : ""
                }`}
              >
                <p>H: +1 (each hydrogen)</p>
                <p>S: +6</p>
                <p>O: -2 (each oxygen)</p>
                <p>Total charge = 2(+1) + (+6) + 4(-2) = 0</p>
              </div>
            </div>

            <div className="practice-problem">
              <p className="font-semibold">Problem 2:</p>
              <p>Balance the following redox reaction in acidic solution:</p>
              <p>MnO4- + Fe2+ → Mn2+ + Fe3+</p>
              <button onClick={() => toggleSolution("problem2")}>
                {visibleSolutions.problem2 ? "Hide Solution" : "Show Solution"}
              </button>
              <div
                className={`solution ${
                  visibleSolutions.problem2 ? "visible" : ""
                }`}
              >
                <p>Balanced equation:</p>
                <p>MnO4- + 5Fe2+ + 8H+ → Mn2+ + 5Fe3+ + 4H2O</p>
                <p>Steps:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Split into half-reactions</li>
                  <li>Balance atoms and charge</li>
                  <li>Multiply Fe2+ reaction by 5</li>
                  <li>Add half-reactions</li>
                </ol>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="topic-container">
      <Link href="/dashboard/courses/chemistry" className="back-button">
        ← Back to Chemistry Course
      </Link>

      <header className="app-header">
        <h1>Redox Reactions</h1>
        <p>Understanding Oxidation-Reduction Reactions and Electron Transfer</p>
      </header>

      <div className="tabs">
        <button
          className={`${activeTab === "concepts" ? "active" : ""}`}
          onClick={() => setActiveTab("concepts")}
        >
          Concepts
        </button>
        <button
          className={`${activeTab === "formulas" ? "active" : ""}`}
          onClick={() => setActiveTab("formulas")}
        >
          Formulas
        </button>
        <button
          className={`${activeTab === "practice" ? "active" : ""}`}
          onClick={() => setActiveTab("practice")}
        >
          Practice
        </button>
      </div>

      <section className="content">{renderContent()}</section>
    </div>
  );
};

// ProjectileMotion Component
const ProjectileMotion: React.FC<TopicProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string>("notes");
  const [visibleSolutions, setVisibleSolutions] = useState<VisibleSolutions>(
    {}
  );
  const [simulationStates, setSimulationStates] = useState<SimulationStates>({
    trajectory: {
      isRunning: false,
      angle: 45,
      velocity: 10,
      height: 0,
    },
    rangeCalculator: {
      input: {
        velocity: "",
        angle: "",
        height: "",
      },
      result: null,
    },
    timeOfFlight: {
      isPlaying: false,
      speed: 1,
      currentTime: 0,
    },
  });

  const toggleSolution = (problemId: string): void => {
    setVisibleSolutions((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <>
            <div className="section introduction">
              <h2>Introduction</h2>
              <p>
                Projectile motion is a form of motion where an object moves in a
                curved path under the influence of gravity alone. The path
                followed by the projectile is called its trajectory, which is
                always a parabola in the absence of air resistance.
              </p>
            </div>
            <div className="section formulas">
              <h2>Important Formulas</h2>
              <div className="formula-grid">
                <div className="formula-card">
                  <h3>Horizontal Motion</h3>
                  <p>
                    x = x₀ + v₀ₓt
                    <br />
                    vₓ = v₀ₓ
                    <br />
                    aₓ = 0
                  </p>
                </div>
              </div>
            </div>
          </>
        );

      case "practice":
        return (
          <div className="section practice">
            <h2>Practice Problems</h2>
            <div className="practice-problem">
              <h3>Problem 1: Maximum Height</h3>
              <p>
                A ball is thrown upward at 30° with initial velocity 40 m/s.
                Find maximum height.
              </p>
              <button onClick={() => toggleSolution("problem1")}>
                {visibleSolutions.problem1 ? "Hide Solution" : "Show Solution"}
              </button>
              <div
                className={`solution ${
                  visibleSolutions.problem1 ? "visible" : ""
                }`}
              >
                <p>h_max = (20)²/(2×9.81) = 20.4 meters</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="topic-container">
      <header>
        <div className="back-button" onClick={onBack}>
          ← Back to Physics Topics
        </div>
      </header>
      <h1>Projectile Motion</h1>
      <div className="tabs">
        <button
          className={activeTab === "notes" ? "active" : ""}
          onClick={() => setActiveTab("notes")}
        >
          📝 Notes
        </button>
        <button
          className={activeTab === "practice" ? "active" : ""}
          onClick={() => setActiveTab("practice")}
        >
          ✍️ Practice
        </button>
      </div>
      <section className="content">{renderContent()}</section>
    </div>
  );
};

// Probability Component
const Probability: React.FC<TopicProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string>("notes");
  const [visibleSolutions, setVisibleSolutions] = useState<VisibleSolutions>(
    {}
  );

  const toggleSolution = (problemId: string): void => {
    setVisibleSolutions((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <div className="section introduction">
            <h2>Introduction</h2>
            <p>
              Probability is a branch of mathematics that deals with the study
              of random phenomena. It provides a way to quantify the likelihood
              of events occurring and helps us make predictions about uncertain
              situations.
            </p>
            <div className="formula-card">
              <h3>Basic Probability</h3>
              <p>P(E) = n(E)/n(S)</p>
              <small>
                Where n(E) is number of favorable outcomes and n(S) is total
                possible outcomes
              </small>
            </div>
          </div>
        );

      case "practice":
        return (
          <div className="section practice">
            <h2>Practice Problems</h2>
            <div className="practice-problem">
              <h3>Problem 1: Basic Probability</h3>
              <p>
                A bag contains 5 red marbles and 3 blue marbles. What is the
                probability of drawing a red marble?
              </p>
              <button onClick={() => toggleSolution("problem1")}>
                {visibleSolutions.problem1 ? "Hide Solution" : "Show Solution"}
              </button>
              <div
                className={`solution ${
                  visibleSolutions.problem1 ? "visible" : ""
                }`}
              >
                <p>P(red) = 5/8 = 0.625 or 62.5%</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="topic-container">
      <header>
        <div className="back-button" onClick={onBack}>
          ← Back to Mathematics Topics
        </div>
      </header>
      <h1>Probability</h1>
      <div className="tabs">
        <button
          className={activeTab === "notes" ? "active" : ""}
          onClick={() => setActiveTab("notes")}
        >
          📝 Notes
        </button>
        <button
          className={activeTab === "practice" ? "active" : ""}
          onClick={() => setActiveTab("practice")}
        >
          ✍️ Practice
        </button>
      </div>
      <section className="content">{renderContent()}</section>
    </div>
  );
};

// Main App Component
const LearningApp: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject["id"] | null>(
    null
  );
  const [selectedTopic, setSelectedTopic] = useState<SelectedTopic | null>(
    null
  );

  const handleBack = (): void => {
    setSelectedTopic(null);
  };

  const subjects: Subject[] = [
    {
      id: "physics",
      title: "🔭 Physics",
      description: "Explore mechanics, waves, and modern physics concepts",
      topics: ["Projectile Motion", "Wave Optics", "Quantum Mechanics"],
    },
    {
      id: "chemistry",
      title: "⚗️ Chemistry",
      description:
        "Discover chemical reactions, bonding, and molecular structures",
      topics: ["Redox Reactions", "Organic Chemistry", "Chemical Bonding"],
    },
    {
      id: "maths",
      title: "📐 Mathematics",
      description: "Master calculus, algebra, and probability concepts",
      topics: ["Probability", "Calculus", "Linear Algebra"],
    },
  ];

  const handleTopicClick = (subject: Subject["id"], topic: string): void => {
    setSelectedTopic({ subject, topic });
  };

  const renderTopicContent = () => {
    if (!selectedTopic) return null;

    if (selectedTopic.topic === "Redox Reactions") {
      return <RedoxReaction onBack={handleBack} />;
    } else if (selectedTopic.topic === "Projectile Motion") {
      return <ProjectileMotion onBack={handleBack} />;
    } else if (selectedTopic.topic === "Probability") {
      return <Probability onBack={handleBack} />;
    }

    return (
      <div className="topic-content">
        <div className="topic-header">
          <button className="back-button" onClick={handleBack}>
            ← Back to {selectedTopic.subject}
          </button>
          <h2>{selectedTopic.topic}</h2>
        </div>
        <div className="topic-body">
          <p>Content for {selectedTopic.topic} is under development.</p>
          <div className="development-notice">
            <p>🚧 Coming Soon!</p>
            <ul>
              <li>Comprehensive notes and explanations</li>
              <li>Interactive simulations and calculators</li>
              <li>Practice problems with step-by-step solutions</li>
              <li>Visual demonstrations and examples</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Interactive Learning Hub</h1>
        <p>Class 12 Science and Mathematics</p>
      </header>

      {selectedTopic ? (
        renderTopicContent()
      ) : (
        <main className="subjects-grid">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className={`subject-card ${
                selectedSubject === subject.id ? "active" : ""
              }`}
              onClick={() =>
                setSelectedSubject(
                  subject.id === selectedSubject ? null : subject.id
                )
              }
            >
              <h2>{subject.title}</h2>
              <p className="subject-description">{subject.description}</p>

              {selectedSubject === subject.id && (
                <div className="subject-details">
                  <h3>Key Topics</h3>
                  <ul className="topics-list">
                    {subject.topics.map((topic) => (
                      <li
                        key={topic}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTopicClick(subject.id, topic);
                        }}
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </main>
      )}
    </div>
  );
};

export default LearningApp;
