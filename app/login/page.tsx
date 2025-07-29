"use client";


import LoginForm from "./LoginForm";
import Link from "next/link";
const LoginPage: React.FC = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 bg-[url('/bg-svg-f.svg')] bg-cover bg-no-repeat">
      <div className="login-wrapper container mx-auto py-8 flex flex-col md:flex-row justify-center items-center">
        {/* Login Form Section */}
        <div className="form-wrapper bg-white shadow-[17px_17px_34px_#d0d0d0] rounded-2xl p-8 md:p-12 w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center md:mr-4">
          <p className="mb-4 text-center text-lg font-bold text-gray-800">
            Login to your account
          </p>
          <p className="mb-4 text-center text-gray-700">
            {" "}
            {/* Added text-gray-700 */}
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-[#ff8500] hover:underline px-1"
            >
              Create a new account
            </Link>
          </p>
          <LoginForm />
          <Link
            href="/register"
            className="text-[#ff8500] hover:underline text-center mt-4"
          >
            Create an account?
          </Link>
        </div>

        {/* About Section */}
        <div className="login-right-side container w-full md:w-1/2 lg:w-2/5 md:ml-4 mt-8 md:mt-0">
          <h4 className="text-sm text-[#ff8500] mb-2">About</h4>
          <h1 className="right_title text-[#4b456f] text-4xl lg:text-5xl font-extrabold leading-tight mb-5">
            Evangadi Networks Q & A
          </h1>
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            {" "}
            {/* Adjusted text color */}
            No matter what stage of life you are in, whether you’re just
            starting elementary school or being promoted to CEO of a Fortune 500
            company, you have much to offer to those who are trying to follow in
            your footsteps.
          </p>
          <p className="text-gray-700 text-base leading-relaxed mb-6">
            {" "}
            {/* Adjusted text color */}
            Whether you are willing to share your knowledge or you are just
            looking to meet mentors of your own, please start by joining the
            network here.
          </p>
          <button className="right-btn bg-[#ff8500] text-white h-10 px-5 rounded-md text-lg hover:bg-orange-600 active:border-3 active:border-[#516cf0] transition-colors duration-300">
            HOW IT WORKS
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
