import React, { FC, useRef, useState, MouseEvent, useEffect } from "react";
import { setAccessToken } from "../utils/context";
import { trpc } from "../utils/trpc";

declare const window: Window &
  typeof globalThis & {
    google: any;
    GoogleAuth: any;
  };

interface Props {
  signupModal: (afterLogin ?: boolean) => void;
}

const Signup: FC<Props> = ({ signupModal }) => {
  const [close, setClose] = useState(false);
  const bgSignup = useRef(null);
  const googleSignInButton = useRef(null);
  const checkUser = trpc.checkUser.useMutation({
    onSuccess(data) {
      setAccessToken(data.accessToken!, "after google login");
      closeHelper(true)
    },
  });

  const closeHelper = async (afterLogin ?: boolean) => {
    setClose(true);
    await new Promise((r) => setTimeout(r, 400));
    if (afterLogin) signupModal(true);
    else signupModal()
  };

  const closeBgSignup = (e: MouseEvent) => {
    if (e.target === bgSignup.current) closeHelper();
  };

  const onResponse = (res: any) => {
    checkUser.mutate({ credential: res.credential });
  };

  const login = () => {
    window.google.accounts.id.initialize({
      client_id:
        "368662961806-c8f2hsectd7urdaiq24dr4n86scbda19.apps.googleusercontent.com",
      callback: onResponse,
    });
    window.google.accounts.id.renderButton(googleSignInButton.current, {
      type: "icon",
      shape: "circle",
    });
  };

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
    <div
      ref={bgSignup}
      onClick={(e) => closeBgSignup(e)}
      className="absolute inset-0 z-10 flex flex-col items-center"
    >
      <div className="h-1/5" />
      <div className="p-8" />
      <div className="border border-red-400 w-64 h-48 rounded-lg shadow flex flex-col items-center py-2 bg-gray-200">
        <img className="h-16 w-16 mt-6" src="/user.png" alt="" />
        <div className="py-2" />
        <button>
          <div ref={googleSignInButton}></div>
        </button>
      </div>
    </div>
  );
};

export default Signup;
