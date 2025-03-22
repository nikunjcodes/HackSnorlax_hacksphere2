"use client";

import Link from "next/link";

const MathCoursePage = () => {
  const courseModules = [
    {
      title: "Math Game",
      description:
        "Practice your math skills with our interactive game featuring addition, subtraction, multiplication, and division.",
      href: "/dashboard/courses/math/math-game",
      icon: "🎮",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
    },
    // Add more modules here as they are developed
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Mathematics Course
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Welcome to the Mathematics course! Here you'll find interactive
          modules and games to help you master various mathematical concepts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseModules.map((module, index) => (
          <Link
            key={index}
            href={module.href}
            className={`${module.color} rounded-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex flex-col h-full">
              <div className="text-4xl mb-4">{module.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {module.title}
              </h3>
              <p className="text-gray-100 flex-grow">{module.description}</p>
              <div className="mt-4">
                <span className="inline-flex items-center text-sm font-medium text-white hover:text-gray-200">
                  Start Learning →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MathCoursePage;
