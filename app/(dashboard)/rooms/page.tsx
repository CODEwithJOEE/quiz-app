export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { DoorOpen, Plus, Users, Clock, BookOpen, Inbox } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { getTeacherRooms, getStudentRooms } from "@/lib/rooms";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

export default async function RoomsPage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");

  if (me.role === "teacher" || me.role === "super_admin") {
    const rooms = await getTeacherRooms(me.id);
    return <TeacherRoomsView rooms={rooms} />;
  }

  const rooms = await getStudentRooms(me.id);
  return <StudentRoomsView rooms={rooms} />;
}

// =====================================================
// TEACHER VIEW
// =====================================================
function TeacherRoomsView({ rooms }: { rooms: any[] }) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">My Rooms</h1>
          <p className="text-xs text-muted-foreground">
            {rooms.length} room{rooms.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/rooms/new">
          <Button size="sm">
            <Plus className="w-4 h-4" />
            New Room
          </Button>
        </Link>
      </div>

      {/* List */}
      {rooms.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="Wala pang rooms"
          description="Create your first room para makapag-invite ng students."
          action={
            <Link href="/rooms/new">
              <Button size="sm">
                <Plus className="w-4 h-4" />
                Create Room
              </Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {rooms.map((r) => (
            <li key={r.id}>
              <Link
                href={`/rooms/${r.id}`}
                className="block bg-card rounded-2xl border border-border shadow-sm hover:border-brand/40 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="p-4 space-y-3">
                  {/* Room icon + name */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                      <DoorOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{r.name}</p>
                      {r.subject && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <BookOpen className="w-3 h-3" />
                          {r.subject}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="success">
                      <Users className="w-3 h-3" />
                      {r.student_count} joined
                    </Badge>
                    {r.pending_count > 0 && (
                      <Badge variant="warning">
                        <Clock className="w-3 h-3" />
                        {r.pending_count} pending
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// =====================================================
// STUDENT VIEW
// =====================================================
function StudentRoomsView({ rooms }: { rooms: any[] }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">My Rooms</h1>
        <p className="text-xs text-muted-foreground">
          {rooms.length} room{rooms.length !== 1 ? "s" : ""}
        </p>
      </div>

      {rooms.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Wala pang rooms"
          description="Hintayin ang invitation ng teacher mo. Lalabas dito kapag na-accept mo na."
        />
      ) : (
        <ul className="space-y-3">
          {rooms.map((m) => (
            <li key={m.id}>
              <Link
                href={`/rooms/${m.rooms.id}`}
                className="block bg-card rounded-2xl border border-border shadow-sm hover:border-brand/40 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <DoorOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{m.rooms.name}</p>
                    {m.rooms.subject && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <BookOpen className="w-3 h-3" />
                        {m.rooms.subject}
                      </div>
                    )}
                    {m.rooms.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {m.rooms.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
