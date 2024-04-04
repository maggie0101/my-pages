"use client";

import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import Image from "next/image";

export default function PetSetting() {
  const pets = [
    "https://i.imgur.com/4ZJH8Xq.jpg",
    "https://i.imgur.com/ruu97P0.jpg",
  ];
  const [pet, setPet] = useState(0);
  const plants = [
    "https://i.imgur.com/SKrmK7n.png",
    "https://i.imgur.com/vH3t01U.jpg",
  ];
  const [plant, setPlant] = useState(0);

  const previousPet = () => {
    if (pet === 0) {
      setPet(pets.length - 1);
    } else {
      setPet(pet - 1);
    }
  };
  const nextPet = () => {
    if (pet === pets.length - 1) {
      setPet(0);
    } else {
      setPet(pet + 1);
    }
  };

  const previousPlant = () => {
    if (plant === 0) {
      setPlant(plants.length - 1);
    } else {
      setPlant(plant - 1);
    }
  };
  const nextPlant = () => {
    if (plant === plants.length - 1) {
      setPlant(0);
    } else {
      setPlant(plant + 1);
    }
  };

  return (
    <>
      <div className="ml-6 mr-6 mt-6 flex items-start py-6">
        <div className="s-auto relative h-full w-64 pb-4">
          <p className="mb-6 font-semibold">請選擇你的寵物:</p>
          <div className="relative overflow-hidden">
            <div
              className={`duration-40 flex transition ease-out`}
              style={{
                transform: `translateX(-${pet * 100}%)`,
              }}
            >
              {pets.map((p) => {
                return (
                  <Image
                    key={p}
                    src={p}
                    alt="pet"
                    width={2580}
                    height={480}
                  ></Image>
                );
              })}
            </div>
            <div className="absolute top-0 flex h-full items-center px-1">
              <button className="text-3xl" onClick={previousPet}>
                <IoIosArrowBack />
              </button>
            </div>
            <div className="absolute right-0 top-0 flex h-full items-center px-1">
              <button className="text-3xl" onClick={nextPet}>
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
        <div className="s-auto relative mr-6 w-64">
          <p className="mb-6 font-semibold">請選擇你的植物:</p>
          <div className="relative overflow-hidden">
            <div
              className={`duration-40 flex transition ease-out`}
              style={{
                transform: `translateX(-${plant * 100}%)`,
              }}
            >
              {plants.map((p) => {
                return (
                  <Image
                    key={p}
                    src={p}
                    alt="plant"
                    width={3000}
                    height={480}
                  ></Image>
                );
              })}
            </div>
            <div className="absolute top-0 flex h-full items-center px-1">
              <button className="text-3xl" onClick={previousPlant}>
                <IoIosArrowBack />
              </button>
            </div>
            <div className="absolute right-0 top-0 flex h-full items-center px-1">
              <button className="text-3xl" onClick={nextPlant}>
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
