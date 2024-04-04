import Progress from "@/components/ui/progress";

import Money from "./Money";

type StatusProps = {
  name: string;
  level: number;
  remainExperience: number;
  healthPoint: number;
  attackPoint: number;
  money: number;
};

export default async function Status({
  name,
  level,
  remainExperience,
  attackPoint,
  healthPoint,
  money,
}: StatusProps) {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="px-7">
        <div className="m-3 flex items-end justify-start">
          <h3 className="mr-3 text-3xl font-bold">{name}</h3>
          <div className=" text-md mx-3 flex h-16 flex-col items-center rounded-xl border-2 border-slate-300 border-opacity-75 bg-purple-100 bg-opacity-60">
            <h1 className="border-b-2 border-slate-300 border-opacity-75  px-2 font-semibold">
              Level
            </h1>
            <h1 className="font-semibold ">{level}</h1>
          </div>

          <Money money={money} />
        </div>
        <div className="flex flex-row">
          <div className="grow">
            <div className="m-1 flex flex-row items-center justify-between">
              <div className="basis-4/5">
                <Progress
                  percentage={((remainExperience / level / 10) * 100)
                    .toFixed()
                    .toString()}
                />
              </div>
              <span className="m-3 mr-5 font-semibold">
                EXP: {remainExperience}
              </span>
            </div>
            <div className="m-1 flex items-center justify-between">
              <div className="basis-4/5">
                <Progress
                  percentage={((healthPoint / 1000) * 100).toFixed().toString()}
                  color="green"
                />
              </div>
              <span className="m-3 mr-5 font-semibold">HP: {healthPoint}</span>
            </div>
            <div className="m-1 flex flex-row items-center justify-between">
              <div className="flex basis-4/5 flex-col justify-center ">
                <Progress
                  percentage={((attackPoint / 1000) * 100).toFixed().toString()}
                  color="green"
                />
              </div>
              <span className="m-3 mr-5 font-semibold">AP: {attackPoint}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
