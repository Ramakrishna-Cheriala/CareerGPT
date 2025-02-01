"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getInterviewPrep({ resumeData, jobDescription }) {
  if (!resumeData || !jobDescription) {
    console.log("Missing resume or job description");
    return new Error("Missing resume or job description");
  }

  const { userId } = await auth();
  if (!userId) return new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: { industryInsights: true },
  });

  if (!user) return new Error("User not found");

  try {
    const prompt = `You are an expert career coach with over 10 years of experience in helping candidates prepare for technical and behavioral interviews. Your task is to generate a personalized interview preparation guide in JSON format based on the user's resume ${resumeData} and the job description ${jobDescription}. You should consider the candidate's experience, skills, and any specific skills they provide. The JSON output should strictly follow the structure below:
    
    {
        "interview_questions": [{"question":"question", "answer": "answer"},{ "question":"question", "answer": "answer"}],
        "important_concepts": ["concept1", "concept2"],
    }
        
        Instructions:

            1. Interview Questions:

            Generate technical questions (DIIFICULTY LEVEL: HARD) based on the skills, tools, and technologies, languages mentioned in the user's resume and job description and also generate relevant answers in 100 words.

            Generate most important behavioral questions based on the job description's requirements (e.g., teamwork, leadership, problem-solving) and also generate relevant answers in 100 words.

            Generate most important scenario-based questions that align with the job role and the user's experience and also generate relevant answers in 100 words.

            2. Important Concepts:

            Identify key concepts, frameworks, tools, technologies, programming languages the user should review based on the job description 

            Highlight any gaps in the user's resume compared to the job description and suggest areas for improvement.


            3. Input from the User:

            Resume: [User's resume text or summary of skills, experience, and projects]

            Job Description: [Job description text or summary of key responsibilities and requirements]

            Output Format:

            The output must be a valid JSON object following the structure above.

            Ensure the output is tailored to the user's resume and job description.
            
            IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
            
            Do not include any additional notes or explanations.
            PROVIDE ATLEAST 25 TECHNICAL INTERVIEW QUESTIONS BASED ON JOB DESCRIPTION AND RESUME FOR THE USER.
            PROVIDE ALL POSSIBLE IMPORTANT CONCEPTS FOR THE USER BASED ON JOB DESCRIPTION.
            `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    // console.log("cleaned text: " + cleanedText);

    return JSON.parse(cleanedText);
  } catch (error) {
    console.log(error);
    return new Error("Failed to generate interview preparation guide");
  }
}

export async function getBriefDescriptionBasedOnConcepts({ concept }) {
  console.log("concept: ", concept);

  if (!concept) return new Error("Missing concept");
  const { userId } = await auth();
  if (!userId) return new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: { industryInsights: true },
  });

  if (!user) return new Error("User not found");

  try {
    const prompt = `You are an expert career coach with over 10 years of experience in helping candidates prepare for technical and behavioral interviews. Your task is to explain about a particular concept ${concept} in detail in about 500 - 1000 words.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.log(error);
    return new Error("Failed to generate interview preparation guide");
  }
}
