import type { Status } from "@/hooks/useGame";
import type { Card } from "@/lib/types/db";

import PlayCard from "./PlayCard";

export default function CardArea({
  hand,
  playCard,
}: {
  hand: (Card & { used: boolean })[];
  playCard: ({ cardId }: { cardId: number }) => Status;
}) {
  return (
    <>
      <div className="bottom-0 m-5 flex items-center justify-center space-x-1">
        <div className="flex overflow-hidden rounded">
          {hand
            .map((card, index) => ({ ...card, index }))
            .filter((card) => !card.used)
            .map((card) => (
              <PlayCard
                key={1}
                cardImage={card.imageUrl}
                playCard={playCard}
                id={card.index}
              />
            ))}
        </div>
      </div>
    </>
  );
}
