import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useUser } from "@/context/usercontext";

export function RoleSelection() {
  const navigate = useNavigate();

  const {userState} = useUser()

  const handleRoleSelection = (role) => {
    if (role === "business") {
      navigate("/business-setup"); // Adjust the route to your desired path for "Business"
    } else if (role === "referrer") {
      navigate("/referrer-setup"); // Adjust the route to your desired path for "Referrer"
    }
  };

  console.log(userState, "from roleselection");

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
    <Card className="mx-auto max-w-5xl px-32 py-12">
      <CardTitle className="text-2xl text-center">Choose Your Role</CardTitle>
      <CardContent className="flex flex-col items-center space-y-4 mt-6">
        <Button 
          className="w-full py-2" 
          onClick={() => handleRoleSelection("business")}
        >
          I am a Business
        </Button>
        <Button 
          className="w-full py-2" 
          onClick={() => handleRoleSelection("referrer")}
          variant="outline"
        >
          I am a Referrer
        </Button>
      </CardContent>
    </Card>
    </div>
  );
}

export default RoleSelection;
