import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useUser } from "@/context/usercontext";
import { Shield, Users, Zap, TrendingUp, Star } from "lucide-react";
import InfoSidebar from "./Infosidebar";

export function RoleSelection() {
  const navigate = useNavigate();

  const { userState } = useUser()

  const handleRoleSelection = (role) => {
    if (role === "business") {
      navigate("/business-setup"); // Adjust the route to your desired path for "Business"
    } else if (role === "referrer") {
      navigate("/referrer-setup"); // Adjust the route to your desired path for "Referrer"
    }
  };

  console.log(userState, "from roleselection");

  return (
    <div className="flex h-screen w-full items-center justify-center">

      <InfoSidebar />


      <Card className="mx-auto max-w-5xl px-12 py-12">

        <div className="flex items-center gap-2 mb-2">
          <div className="w-12 h-12 bg-white rounded-xl overflow-hidden p-1">
            <img
              src="https://cdn.cmsfly.com/680cda66c612a5002b6d29d1/images/Screenshot2025-07-24at103638PM-L1HtJ.png"
              alt=""
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ATTACH-N'-HATCH
          </span>
        </div>

        <CardTitle className="text-2xl text-center">Welcome! Let’s get to know you better. <br /> How will you be using the platform?</CardTitle>
        <CardContent className="flex flex-col items-center space-y-4 mt-6">
          <Button
            className="w-full py-2"
            onClick={() => handleRoleSelection("business")}
          >
            Business Owner
          </Button>
          <Button
            className="w-full py-2"
            onClick={() => handleRoleSelection("referrer")}
            variant="outline"
          >
            Invited by a Owner as a Referrer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default RoleSelection;
