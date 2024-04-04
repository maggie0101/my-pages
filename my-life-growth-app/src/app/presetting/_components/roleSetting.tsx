"use client";

import { useState } from "react";
import { type Dispatch, type SetStateAction } from "react";

import Image from "next/image";

type RoleSettingProps = {
  setCharacter: Dispatch<SetStateAction<"study" | "work" | "health" | "hobby">>;
};

export default function RoleSetting({ setCharacter }: RoleSettingProps) {
  const [role, setRole] = useState(1);
  const roles = ["/study.png", "/work.png", "/health.png", "/hobby.png"];

  return (
    <>
      <div className="ml-6 mr-6 mt-6 flex p-6 ">
        <div className="min-w-screen grid place-content-center items-start ">
          <p className="font-semibold">請選擇您想專注的目標:</p>
          <table className="my-2 h-16 w-64 border-collapse border border-slate-600">
            <tbody>
              <tr>
                <td className="border-2 border-black text-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5  "
                    name="radio-colors"
                    onClick={() => {
                      setRole(1);
                      setCharacter("study");
                    }}
                    checked={role === 1}
                  />
                  <label>學業</label>
                </td>
                <td className="border-2 border-black text-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 "
                    name="radio-colors"
                    onClick={() => {
                      setRole(2);
                      setCharacter("work");
                    }}
                    checked={role === 2}
                  />
                  <label>工作</label>
                </td>
              </tr>
              <tr>
                <td className="border-2 border-black text-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 "
                    name="radio-colors"
                    onClick={() => {
                      setRole(3);
                      setCharacter("health");
                    }}
                    checked={role === 3}
                  />
                  <label>健康</label>
                </td>
                <td className="border-2 border-black text-center ">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 "
                    name="radio-colors"
                    onClick={() => {
                      setRole(4);
                      setCharacter("hobby");
                    }}
                    checked={role === 4}
                  />
                  <label>興趣</label>
                </td>
              </tr>
            </tbody>
          </table>

          <Image
            src={roles[role - 1]}
            alt="role"
            className="w-64"
            width={200}
            height={48}
          />
        </div>
      </div>
    </>
  );
}
