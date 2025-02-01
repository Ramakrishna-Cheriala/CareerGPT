"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import * as pdfjsLib from "pdfjs-dist";
import { getInterviewPrep } from "@/actions/interview";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import InterviewPrep from "./_components/interview-prep";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const Interview = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");

  const {
    loading: generating,
    fn: getInterviewPrepfn,
    data: generatedData,
  } = useFetch(getInterviewPrep);

  useEffect(() => {
    if (generatedData) {
      toast.success("All the Best for your Interview");
      console.log(generatedData);
    }
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!validateFile(file)) return;

    try {
      const text = await extractTextFromPDF(file);
      setResumeText(text);
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Error extracting text. Please try again.");
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be under 2MB.");
      return false;
    }
    return true;
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      extractedText += textContent.items
        .map((item) => item.str)
        .join(" ")
        .concat("\n");
    }

    return extractedText.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!resumeText || !jobDescription) {
        alert("Please provide both resume and job description");
        return;
      }
      await getInterviewPrepfn({ resumeData: resumeText, jobDescription });
    } catch (error) {
      console.log(error.message);
      toast.error("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <Card className="shadow-lg">
        <CardDescription className="p-6 text-lg">
          Provide Resume along with the Job Description
        </CardDescription>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Resume (PDF, max 2MB)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2"
                  disabled={generating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Job Description
                </label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here"
                  className="h-32"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button type="submit" disabled={generating} variant="outline">
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wait a moment...
                    </>
                  ) : (
                    "Prepare for Interview"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {generatedData && <InterviewPrep data={generatedData} />}
    </div>
  );
};

export default Interview;
