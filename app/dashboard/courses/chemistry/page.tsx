"use client";

import { useState } from "react";
import Link from "next/link";

const ChemistryCourse = () => {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  const topics = [
    {
      id: "redox-reactions",
      title: "Redox Reactions",
      description:
        "Learn about oxidation-reduction reactions and electron transfer.",
      topics: [
        "Oxidation and Reduction",
        "Oxidation Numbers",
        "Balancing Redox Equations",
        "Applications in Real Life",
      ],
    },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Chemistry Learning Hub</h1>
        <p>
          Explore chemistry concepts through interactive lessons and practice
          problems
        </p>
      </header>

      <div className="subjects-grid">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className={`subject-card ${
              activeSubject === topic.id ? "active" : ""
            }`}
            onClick={() => setActiveSubject(topic.id)}
          >
            <h2 className="text-xl font-bold mb-2">{topic.title}</h2>
            <p className="text-gray-300 mb-4">{topic.description}</p>

            {activeSubject === topic.id && (
              <div className="subject-details">
                <h3 className="text-lg font-semibold mb-2">Topics Covered:</h3>
                <ul className="topics-list">
                  {topic.topics.map((subtopic, index) => (
                    <li key={index}>
                      <Link href={`/dashboard/courses/chemistry/${topic.id}`}>
                        {subtopic}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChemistryCourse;
