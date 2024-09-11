"use client";
import { loginBack } from "@/lib/query";
import { useState, useEffect, useRef, Suspense } from "react";

declare const window: Window &
    typeof globalThis & {
        google: any;
        GoogleAuth: any;
    };

export default function Login() {
    const signinButton = useRef(null);

    const login = () => {
        window.google.accounts.id.initialize({
            client_id:
                "368662961806-c8f2hsectd7urdaiq24dr4n86scbda19.apps.googleusercontent.com",
            callback: onResponse,
        });
        window.google.accounts.id.renderButton(signinButton.current, {
            type: "icon",
            size: "large",
            shape: "pill",
        });
    };

    const onResponse = async (data: any) => {
        try {
            await loginBack(data.credential);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        document.body.appendChild(script);
        script.addEventListener("load", () => {
            login();
        });
    }, []);
    return (
        <div className="mt-8 flex items-center flex-col">
            <p className="font-semibold text-gray-700 text-xl">Continue with google</p>
            <div ref={signinButton}></div>
        </div>
    );
}
