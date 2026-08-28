import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LoginScreen } from "@/components/game/LoginScreen";
import { Workstation } from "@/components/game/Workstation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Terminal Mission: 2047 — Interactive Terminal Adventure" },
      {
        name: "description",
        content:
          "A story-driven terminal adventure: investigate four reconstructed ARPANET nodes and stop an AI called Shoggoth using real Linux and macOS commands.",
      },
      { property: "og:title", content: "Terminal Mission: 2047" },
      {
        property: "og:description",
        content:
          "Investigate four ARPANET nodes with real terminal commands and recover the origin trace before 2047.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [studentName, setStudentName] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [farewell, setFarewell] = useState(false);
  const [lastName, setLastName] = useState("");

  if (!studentName)
    return (
      <LoginScreen
        farewell={farewell}
        studentName={lastName}
        onLogin={(n) => {
          setFarewell(false);
          setSessionKey((k) => k + 1);
          setStudentName(n);
        }}
      />
    );

  return (
    <Workstation
      key={sessionKey}
      studentName={studentName}
      onFinish={() => {
        setLastName(studentName);
        setFarewell(true);
        setStudentName(null);
      }}
    />
  );
}
