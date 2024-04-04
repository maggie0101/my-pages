import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  label: string;
  type: React.HTMLInputTypeAttribute;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

function AuthInput({ label, type, value, setValue }: Props) {
  return (
    <div className="w-full">
      <Label>{label}</Label>
      <Input
        className="rounded-xl border-slate-200"
        style={{
          backgroundImage: "url('https://i.imgur.com/d8M3epc.jpg')",
        }}
        type={type}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}

export default AuthInput;
