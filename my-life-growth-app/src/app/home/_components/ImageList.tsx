/* eslint-disable @next/next/no-img-element */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Item = {
  id: number;
  name: string;
  url: string;
};

type ImageListProps = {
  items: Item[];
};
export default function ImageList({ items }: ImageListProps) {
  return (
    <div className="flex h-full w-full flex-row overflow-x-scroll">
      {items.map((item) => (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger>
              <img
                className="w-120 m-3 h-60 object-scale-down p-3"
                alt="item"
                src={item.url}
                width={120}
                height={100}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>tipCo{item.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
