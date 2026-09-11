import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import QuizEditor from "./QuizEditor";
import QuizStudentView from "./QuizStudentView";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const me = await getCurrentProfile();
  if (!me) redirect("/login");

  const supabase = await createClient();

  const { data: quiz } = await supabase
    .from("quizzes")
    .select(
      `
      id, title, description, status, time_limit_minutes,
      room_id,
      rooms ( id, name, teacher_id )
    `,
    )
    .eq("id", quizId)
    .single();

  if (!quiz) notFound();

  const isOwner = (quiz as any).rooms?.teacher_id === me.id;

  const { data: questions } = await supabase
    .from("questions")
    .select(
      `
      id, question_text, question_type, points, order_index,
      options ( id, option_text, is_correct, order_index )
    `,
    )
    .eq("quiz_id", quizId)
    .order("order_index", { ascending: true });

  const sorted = (questions ?? []).map((q: any) => ({
    ...q,
    options: (q.options ?? []).sort(
      (a: any, b: any) => a.order_index - b.order_index,
    ),
  }));
  if (isOwner) {
    return <QuizEditor quiz={{ ...quiz, questions: sorted }} isOwner={true} />;
  }

  // Student
  if (quiz.status !== "published") {
    return (
      <div className="bg-white p-4 rounded-2xl shadow-sm text-sm text-gray-500">
        Hindi pa available ang quiz na ito.
      </div>
    );
  }

  // Check if student already has an attempt
  const { data: existingAttempt } = await supabase
    .from("attempts")
    .select("id, status, score, total_points")
    .eq("quiz_id", quizId)
    .eq("student_id", me.id)
    .maybeSingle();

  if (existingAttempt && existingAttempt.status !== "in_progress") {
    // Already done → show result
    redirect(`/quiz/${quizId}/result`);
  }

  return (
    <QuizStudentView
      quiz={{
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        time_limit_minutes: quiz.time_limit_minutes,
        questions: sorted.map((q: any) => ({
          id: q.id,
          question_text: q.question_text,
          points: q.points,
          order_index: q.order_index,
          // ⚠️ Strip is_correct from options — students must not see the answer
          options: q.options.map((o: any) => ({
            id: o.id,
            option_text: o.option_text,
            order_index: o.order_index,
          })),
        })),
      }}
    />
  );
}
