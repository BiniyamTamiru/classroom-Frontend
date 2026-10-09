import type {Subject} from "@/types";

export const MOCK_SUBJECTS: Subject[] = [
    {
        id: 1,
        code: "CS101",
        name: "Introduction to Computer Science",
        department: "CS",
        description:
            "An introduction to programming, algorithms, and fundamental computer science concepts.",
    },
    {
        id: 2,
        code: "MATH201",
        name: "Linear Algebra",
        department: "Math",
        description:
            "Study of vectors, matrices, linear transformations, and systems of equations.",
    },
    {
        id: 3,
        code: "SE301",
        name: "Software Engineering",
        department: "Software Engineering",
        description:
            "Principles and practices for designing, building, testing, and maintaining software systems.",
    },
];
export const getMockSubjects = () => MOCK_SUBJECTS;