/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

import type { Status } from "@/hooks/useGame";

type PlayCardProps = {
  cardImage: string;
  id: number;
  playCard: ({ cardId }: { cardId: number }) => Status;
};

export default function PlayCard({ cardImage, playCard, id }: PlayCardProps) {
  return (
    <div className="m-2">
      <button onClick={() => playCard({ cardId: id })}>
        <Image src={cardImage} alt="role" width={130} height={24} />
      </button>
    </div>
  );
}
