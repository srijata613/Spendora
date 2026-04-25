import React from "react";
import AIAssistant from "@/components/ai-assistant";

const MainLayout = ({ children }) => {
  return (
    <>
      <div className="container mx-auto my-32">
        {children}
      </div>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </>
  );
};

export default MainLayout;