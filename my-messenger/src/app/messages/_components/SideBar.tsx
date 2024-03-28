import Link from "next/link";
import { redirect } from "next/navigation";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { IconButton } from "@mui/material";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

export default async function SideBar() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.displayId, userId),
  });

  return (
    <div className="flex flex-col items-center justify-center border-r bg-slate-100 p-4">
      <div className="ml-2 mt-2 text-2xl font-bold text-gray-800">
        <div>{user?.username}</div>
      </div>
      <div className="ml-2 font-bold text-gray-800">
        <p>Welcome to chatroom!</p>
      </div>
      {/* Add more content as needed */}
      <div className="mt-4">
        <Link href={`/auth/signout`}>
          <IconButton type="submit">
            <ExitToAppIcon />
          </IconButton>
        </Link>
      </div>
    </div>
  );
}
