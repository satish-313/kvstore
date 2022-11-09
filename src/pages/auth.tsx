import { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { Loading } from "../components";
import { setAccessToken } from "../utils/context";

declare const window: Window &
  typeof globalThis & {
    google: any;
    GoogleAuth: any;
  };

interface res {
  clientId: string;
  credential: string;
}

const Auth = () => {
  const googleSignInButton = useRef(null);
  const router = useRouter();
  const checkUser = trpc.checkUser.useMutation();

  const onResponse = async (res: res) => {
    checkUser.mutate({ credential: res.credential });
  };

  const login = () => {
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: onResponse,
    });
    window.google.accounts.id.renderButton(googleSignInButton.current, {
      type: "icon",
      shape: "circle",
    });
  };

  if (checkUser.isLoading) return <Loading />;
  if (checkUser.data?.validUser) {
    setAccessToken(checkUser.data.accessToken!);
    router.push("/");
  }

  useEffect(() => {
    if (window && document) {
      const script = document.createElement("script");
      const body = document.getElementsByTagName("body")[0];
      script.src = "https://accounts.google.com/gsi/client";
      body.appendChild(script);
      script.addEventListener("load", () => {
        login();
      });
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="p-8" />
      <div className="border border-red-400 w-60 rounded-lg shadow flex flex-col items-center py-2">
        <img className="h-16 w-16" src="/user.png" alt="" />
        <div className="py-2" />
        <button>
          <div ref={googleSignInButton}></div>
        </button>
      </div>
    </div>
  );
};

export default Auth;
