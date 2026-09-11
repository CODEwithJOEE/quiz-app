import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import CreateQuizForm from "./CreateQuizForm";

export default async function NewQuizPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const me = await getCurrentProfile();
  if (!me || me.role !== "teacher") redirect("/rooms");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Create New Quiz</h1>
      <CreateQuizForm roomId={roomId} />
    </div>
  );
}
