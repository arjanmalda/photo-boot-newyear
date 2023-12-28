"use client";

import { usePathname } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  Fragment,
  ReactNode,
  useCallback,
  useState,
} from "react";

interface Properties {
  children?: ReactNode;
}

export const PasswordProtection = ({ children }: Properties) => {
  const pathName = usePathname();

  const [password, setPassword] = useState("");
  const [checkPasswordStatus, setCheckPasswordStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");

  const onPasswordChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
      setPassword(value),
    []
  );

  const checkPassword = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      setCheckPasswordStatus("loading");
      const response = await fetch("/api/password-protection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageSlug: pathName.replaceAll("/", ""),
          password,
        }),
      });

      const json = await response.json();

      if (json?.isValid) {
        setCheckPasswordStatus("success");
      } else {
        setCheckPasswordStatus("error");
      }
    },
    [password, pathName]
  );

  return checkPasswordStatus === "success" ? (
    children
  ) : (
    <Fragment>
      <form
        onSubmit={checkPassword}
        className="flex flex-col items-center justify-center gap-3 px-3 py-10"
      >
        <input
          type="password"
          placeholder="Wachtwoord voor deze pagina"
          value={password}
          onChange={onPasswordChange}
          className={`w-full max-w-lg text-black ${
            checkPasswordStatus !== "error" && "border-black"
          } px-5 py-3 ${checkPasswordStatus === "error" && "border-red-600"}`}
        />
        <button type="submit" disabled={checkPasswordStatus === "loading"}>
          Wachtwoord controleren
        </button>
        {checkPasswordStatus === "loading" && <p>Wachtwoord controleren...</p>}
        {checkPasswordStatus === "error" && (
          <p className="text-red-600">Wachtwoord is incorrect</p>
        )}
      </form>
    </Fragment>
  );
};
