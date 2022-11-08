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
  const { mutate, data, isLoading, error } = trpc.checkUser.useMutation();

  const onResponse = async (res: res) => {
    mutate({ credential: res.credential });
  };

  const login = () => {
    window.google.accounts.id.initialize({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      callback: onResponse,
    });
    window.google.accounts.id.renderButton(googleSignInButton.current, {
      type: "icon",
      shape: "circle",
    });
  };

  if (isLoading) return <Loading />;
  if (data?.validUser) {
    setAccessToken(data.accessToken!);
    router.replace("/");
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="p-8" />
      <div className="border border-red-400 w-60 rounded-lg shadow flex flex-col items-center py-2">
        <img className="h-16 w-16" src="/user.png" alt="" />
        <div className="py-2" />
        <button onClick={() => login()}>
          <div ref={googleSignInButton}>
            <img
              src="/google-icon.png"
              className="w-10 object-contain"
              alt=""
            />
          </div>
        </button>
      </div>
      {error && <p>something went wrong {error.message}</p>}
    </div>
  );
};

export default Auth;
