"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tips } from "@/data/tips";
import { getBriefDescriptionBasedOnConcepts } from "@/actions/interview";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import MDEditor from "@uiw/react-md-editor";
import { Loader2, SquareX } from "lucide-react";
import { Button } from "@/components/ui/button";

const InterviewPrep = ({ data }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [currentConcept, setCurrentConcept] = useState("");
  const [aiExplanation, setAIExplanation] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (concept) => {
    if (!concept) {
      console.error("No concept provided");
      return;
    }

    try {
      setGenerating(true);
      setCurrentConcept(concept);
      setAIExplanation("");
      setAlertOpen(true);

      // Pass concept directly, not as an object
      const response = await getBriefDescriptionBasedOnConcepts({
        concept: concept,
      });

      if (response instanceof Error) {
        throw response; // Handle errors properly
      }

      if (response) {
        setAIExplanation(response);
      } else {
        setAIExplanation("Failed to generate explanation. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching explanation:", error);
      setAIExplanation(
        error.message || "An error occurred while generating the explanation."
      );
    } finally {
      setGenerating(false);
    }
  };

  // Validate data prop
  if (!data || !data.interview_questions || !data.important_concepts) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Required data is missing</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center gradient-title">
        Interview Preparation Guide
      </h1>

      {/* Interview Questions Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Interview Questions</CardTitle>
          <CardDescription>
            Prepare for technical, behavioral, and scenario-based questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.interview_questions.map((question, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="text-sm mt-1">
                  {index + 1}. {question.question}
                </p>
                <p className="text-sm mt-3">Ans: {question.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Concepts Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Important Concepts</CardTitle>
          <CardDescription>
            Review these key topics to strengthen your knowledge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.important_concepts.map((concept, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-sm cursor-pointer hover:bg-gray-300 hover:text-gray-900"
                onClick={() => handleGenerate(concept)}
                disabled={generating && currentConcept === concept}
              >
                {generating && currentConcept === concept ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  concept
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tips</CardTitle>
          <CardDescription>
            Follow these tips to ace your interview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tips.map((tip, index) => (
              <div key={index} className="p-4 border rounded-lg flex">
                <p className="text-sm mt-1">
                  {index + 1}. {tip}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Explanation Modal */}
      {alertOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Alert className="w-11/12 max-w-2xl h-[70vh] relative flex flex-col overflow-hidden ">
            <button
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 hover:text-gray-800"
              onClick={() => setAlertOpen(false)}
            >
              <SquareX className="h-4 w-4" />
            </button>
            <AlertTitle className="text-lg font-bold mb-4">
              {currentConcept}
            </AlertTitle>
            <AlertDescription className="flex-1 overflow-y-auto pl-2 pr-2">
              {generating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-gray-500">Generating explanation...</p>
                </div>
              ) : aiExplanation ? (
                <MDEditor.Markdown
                  source={aiExplanation}
                  style={{ paddingRight: "10px", paddingLeft: "10px" }}
                />
              ) : (
                <p className="text-gray-500">No explanation available</p>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
