"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, DoorOpen, BookOpen } from "lucide-react";
import { respondToInvitation } from "../rooms/invitations/actions";
import { Button } from "@/components/ui/Button";

export default function InvitationCard({ invitation }: { invitation: any }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const room = invitation?.rooms;

  if (!room) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-2xl text-sm text-amber-800 dark:text-amber-300">
        ⚠️ Invitation data incomplete. Refresh the page.
      </div>
    );
  }

  function respond(response: "accepted" | "declined") {
    startTransition(async () => {
      const res = await respondToInvitation(invitation.id, response);
      if (res?.error) alert(res.error);
      router.refresh();
    });
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Colored accent bar */}
      <div className="h-1 bg-brand" />

      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
            <DoorOpen className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{room.name}</p>
            {room.subject && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <BookOpen className="w-3 h-3" />
                {room.subject}
              </div>
            )}
            {room.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {room.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => respond("declined")}
            disabled={pending}
          >
            <X className="w-3.5 h-3.5" />
            Decline
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => respond("accepted")}
            disabled={pending}
            loading={pending}
          >
            {!pending && <Check className="w-3.5 h-3.5" />}
            {pending ? "..." : "Accept"}
          </Button>
        </div>
      </div>
    </div>
  );
}
