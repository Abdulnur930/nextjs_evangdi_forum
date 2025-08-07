"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const SingleQue = () => {
  const params = useParams(); // returns { id: "123" } if your route is /answer/[id]
  const [question, setQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    fetchSingleQuestion();
  }, []);

  const fetchSingleQuestion = async () => {
    try {
      const { data } = await axios.get(`/api/questions/${params.id}`);
      setQuestion(data);
    } catch (error) {
      console.error("Something went wrong:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500 text-lg">Loading question...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500 text-lg">
          Failed to load question.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <h3 className="text-xl font-semibold text-indigo-600 mb-2">Question</h3>
        <h2 className="text-2xl font-bold mb-1">{question.title}</h2>
        <p className="text-gray-700">{question.description}</p>
      </div>
      <hr className="my-6" />
    </div>
  );
};

export default SingleQue;
