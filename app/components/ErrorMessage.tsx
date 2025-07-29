import React, { PropsWithChildren } from "react";

const ErrorMessage = ({ children }: PropsWithChildren) => {
  if (!children) return null;

  return (
    <p className="text-red-500 text-sm mt-1">
      {" "}
      {/* Adjust text-sm or mt-1 as needed for desired spacing/size */}
      {children}
    </p>
  );
};

export default ErrorMessage;
