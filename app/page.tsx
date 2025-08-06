"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import Image from "next/image"; 
import Homepageloading from "./loading";

const Home = () => {
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ username: string | null }>({
    username: "Guest",
  }); // Placeholder for user data

  useEffect(() => {
    axios.defaults.withCredentials = true;

    // Fetch all questions when the component mounts
    fetchAllQuestions();
  }, []);

  const fetchAllQuestions = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/questions");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setAllQuestions(data);

      // We also fetch the user from a session endpoint to display their name.
      const userRes = await axios.get("/api/auth/check-session");
      if (userRes.data.loggedIn) {
        setUser({ username: userRes.data.username }); // Assuming the API returns username
      } else {
        setUser({ username: "Guest" });
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Something went wrong:", error);
      setIsLoading(false);
    }
  };

  const handleAskQuestion = () => {
    router.push("/ask");
  };

  return (
    <>
      {isLoading ? (
        <Homepageloading />
      ) : (
        <div className="container mx-auto my-5 p-4 md:p-0 min-h-[65vh] text-blue-950">
          <div className="flex flex-col md:flex-row justify-between items-center mb-5">
            <button
              onClick={handleAskQuestion}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md text-lg hover:bg-orange-500 active:ring-4 active:ring-blue-600 transition-colors duration-300 w-full md:w-auto"
            >
              Ask Question
            </button>
            <h5 className="mt-4 md:mt-0 text-lg font-semibold">
              Welcome:
              <span className="font-bold"> {user?.username}</span>
            </h5>
          </div>

          <h3 className="mt-6 mb-4 text-2xl font-bold border-b-2 border-gray-200 pb-2">
            Questions
          </h3>

          <div>
            {allQuestions.length > 0 ? (
              allQuestions.map((item) => (
                <div key={item.questionid}>
                  <Link href={`/answer/${item.questionid}`} passHref>
                    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white hover:bg-gray-100 transition-colors duration-300 border-b border-gray-200 last:border-b-0 cursor-pointer">
                      <div className="flex flex-col md:flex-col items-center w-full md:w-2/12">
                        <Image
                          src="/User.png"
                          alt="avatar"
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-full object-cover p-1 bg-gray-300 group-hover:bg-blue-950 transition-colors duration-300"
                        />
                        <h6 className="mt-2 md:mt-0 md:ml-3 text-lg font-semibold">
                          {item?.username || "Anonymous"}
                        </h6>
                      </div>
                      <div className="w-full md:w-9/12 my-2 md:my-0 text-center md:text-left">
                        <h6 className="text-xl font-bold">{item.title}</h6>
                      </div>
                      <div className="w-full md:w-1/12 flex justify-center mt-2 md:mt-0">
                        <ChevronRight className="h-8 w-8 text-gray-500 hover:ml-4 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-lg text-gray-500 mt-10">
                No questions found.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
