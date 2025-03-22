"use client";

import Link from "next/link";

const courses = [
  {
    title: "Mathematics",
    description:
      "Master mathematical concepts through interactive games and exercises. Features addition, subtraction, multiplication, and division practice.",
    href: "http://localhost:5173",
    icon: "📐",
    color: "bg-gradient-to-br from-blue-900 to-indigo-900",
    modules: ["Math Game", "More modules coming soon"],
    level: "All Levels",
    external: true,
  },
  {
    title: "Chemistry",
    description:
      "Explore fundamental concepts in chemistry through interactive lessons, practice problems, and real-world applications.",
    href: "/dashboard/courses/chemistry",
    icon: "⚗️",
    color: "bg-gradient-to-br from-purple-900 to-indigo-900",
    modules: ["Redox Reactions", "More modules coming soon"],
    level: "Intermediate",
    external: false,
  },
];

const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Available Courses
        </h1>
        <p className="text-xl text-gray-300">
          Choose from our selection of interactive courses designed to enhance
          your learning experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {courses.map((course, index) => {
          const CourseLink = course.external ? "a" : Link;
          return (
            <CourseLink
              key={index}
              href={course.href}
              target={course.external ? "_blank" : undefined}
              rel={course.external ? "noopener noreferrer" : undefined}
              className={`${course.color} rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl block`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{course.icon}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                    {course.level}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  {course.title}
                </h2>
                <p className="text-gray-100 mb-4">{course.description}</p>
                <div className="border-t border-white/20 pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Available Modules:
                  </h3>
                  <ul className="space-y-1">
                    {course.modules.map((module, moduleIndex) => (
                      <li
                        key={moduleIndex}
                        className="text-gray-300 text-sm flex items-center"
                      >
                        <span className="mr-2">•</span>
                        {module}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex items-center text-white">
                  <span className="text-sm font-medium">Start Learning</span>
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </CourseLink>
          );
        })}
      </div>
    </div>
  );
};

export default CoursesPage;
