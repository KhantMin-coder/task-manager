import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Medal } from "lucide-react";
import { Poppins } from "next/font/google";
import React from "react";

const textFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const Marketing = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col">
        <div className="mb-4 flex items-center border shadow-sm p-4 bg-blue-100 text-blue-600 rounded-full uppercase">
          My Task Manager
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-700 mb-6">
          Work Faster with my task manager
        </h1>
      </div>
      <div
        className={cn(
          "text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto",
          textFont.className
        )}
      >
        Facilitate cohesive teamwork, drive project management initiatives, and
        elevate productivity levels. Whether your teams operate in high-rise
        offices or remote home environments, their workflow is distinctive and
        requires tailored solutions.
      </div>
      <Button className="mt-6" size="lg" variant="default">
        Start Creating
      </Button>
    </div>
  );
};

export default Marketing;
