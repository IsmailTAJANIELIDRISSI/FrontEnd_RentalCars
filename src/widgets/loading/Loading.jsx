import React from "react";
import { Spinner } from "flowbite-react";

const Loading = ({
  size = "xl",
  alignment = "center",
  ariaLabel = "Loading...",
}) => {
  // Define alignment classes based on the alignment prop
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`flex justify-${alignment} h-full items-center py-4`}>
      <Spinner aria-label={ariaLabel} size={size} />
    </div>
  );
};

export default Loading;
