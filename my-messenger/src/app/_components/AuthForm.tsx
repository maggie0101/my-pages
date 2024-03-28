
"use client";

import * as React from "react";
import { useState } from "react";

import { signIn } from "next-auth/react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { publicEnv } from "@/lib/env/public";

import AuthInput from "./AuthInput";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn("credentials", {
      email,
      username,
      password,
      callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/messages`,
    });
  };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign {isSignUp ? "up" : "in"} </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <AuthInput
            label="email"
            type="email"
            value={email}
            setValue={setEmail}
          />
          {isSignUp && (
            <AuthInput
              label="username"
              type="username"
              value={username}
              setValue={setUsername}
            />
          )}
          <AuthInput
            label="password"
            type="password"
            value={password}
            setValue={setPassword}
          />
          {isSignUp && (
            <AuthInput
              label="confirm your password"
              type="password"
              value={confirmPassword}
              setValue={setConfirmPassword}
            />
          )}
          <div className="text-sm text-gray-500">
            {isSignUp ? (
              <span>
                Already have an account?{" "}
                <a
                  className="cursor-pointer hover:underline"
                  onClick={() => {
                    setIsSignUp(false);
                  }}
                >
                  Sign in
                </a>
              </span>
            ) : (
              <span>
                Do not have an account?{" "}
                <a
                  className="cursor-pointer hover:underline"
                  onClick={() => {
                    setIsSignUp(true);
                  }}
                >
                  Sign up
                </a>
              </span>
            )}
          </div>
          <div className="flex grid grid-cols-1 flex-col gap-4">
            <Button type="submit" className="flex flex-col space-y-1.5">
              Sign {isSignUp ? "up" : "in"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="grid w-full items-center gap-4">
        <div className="flex w-full items-center gap-1 py-2">
          <div className="h-[1px] grow border-t"></div>
          <p className="text-xs text-gray-400">or</p>
          <div className="h-[1px] grow border-t"></div>
        </div>

        <Button
          onClick={async () => {
            // TODO: sign in with github
            signIn("github", {
              callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/messages`,
            });
          }}
          className="flex w-full"
          variant={"outline"}
        >
          <span className="grow">Sign In with Github</span>
          <Image src="/github.png" alt="github icon" width={20} height={20} />
        </Button>
      </CardFooter>
    </Card>
  );
}

