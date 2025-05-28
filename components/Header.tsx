import { PanelLeft } from "lucide-react";
import React from "react";

export default function Header() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primaryblue text-center mb-4">
        Eventura
      </h1>

      <div className="bg-white relative flex flex-col w-fit h-fit p-1 mt-4 ml-4 rounded-lg">
        {/* <PanelLeft onClick={() => setIsActiveSidebar(!isActiveSidebar)} /> */}
      </div>
      {/* <hr className="mb-4" /> */}
    </div>
  );
}
