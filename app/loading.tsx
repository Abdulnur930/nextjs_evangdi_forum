import Skeleton from "@/app/components/Skeleton";

const Homepageloading = () => {
  // Array to map and create multiple skeleton question items
  const skeletonItems = Array.from({ length: 5 }); // Display 5 skeleton items

  return (
    <div className="container mx-auto my-5 p-4 md:p-0 min-h-[65vh] text-blue-950">
      {/* Ask Question Button Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-5">
        <button
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md text-lg hover:bg-orange-500 active:ring-4 active:ring-blue-600 transition-colors duration-300 w-full md:w-auto"
            >
              Ask Question
            </button>
        <h5 className="mt-4 md:mt-0 text-lg font-semibold">
          Welcome:
          <span className="font-bold ml-2">
            <Skeleton width={100} /> {/* Skeleton for username */}
          </span>
        </h5>
      </div>

      {/* Questions Heading Skeleton */}
      <h3 className="mt-6 mb-4 text-2xl font-bold border-b-2 border-gray-200 pb-2">
         Questions
      </h3>

      {/* Individual Question Skeletons */}
      <div>
        {skeletonItems.map((_, index) => (
          <div key={index} className="mb-4">
            {" "}
            {/* Added margin-bottom for spacing between skeletons */}
            <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white border-b border-gray-200 last:border-b-0">
              <div className="flex flex-col md:flex-col items-center w-full md:w-2/12">
                {/* Avatar Skeleton */}
                <Skeleton
                  circle
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover p-1 bg-gray-300"
                />
                {/* Username Skeleton */}
                <h6 className="mt-2 md:mt-0 md:ml-3 text-lg font-semibold">
                  <Skeleton width={80} />
                </h6>
              </div>
              <div className="w-full md:w-9/12 my-2 md:my-0 text-center md:text-left">
                {/* Question Title Skeleton */}
                <h6 className="text-xl font-bold">
                  <Skeleton width="80%" height={24} />{" "}
                  {/* Full width skeleton for title */}
                </h6>
              </div>
              <div className="w-full md:w-1/12 flex justify-center mt-2 md:mt-0">
                {/* Arrow Icon Placeholder (can be a small skeleton or just the icon) */}
                <Skeleton circle width={32} height={32} />{" "}
                {/* Skeleton for arrow icon */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepageloading;
