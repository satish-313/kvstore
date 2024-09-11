"use server";
import { cookies } from "next/headers";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import dbConnect from "@/db/initialize";
import { kvu, kvp } from "@/db/models";
import { redirect } from "next/navigation";
import { ObjectId } from "mongoose";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
    process.env.ACCESS_TOKEN_SECRET!
);
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
    process.env.REFRESH_TOKEN_SECRET
);
type NJWTPayload = JWTPayload & { user_id: string , tokenversion ?: string};

type userType = {
    _id: ObjectId;
    name: string;
    email: string;
    picture: string;
    tokenversion: string;
};

type tokenReturn<T> = {
    error: string | null;
    data: T | null;
};

async function verifyToken(token: string) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
}

function setCookie(name: string, value: string) {
    cookies().set({
        name: `${name}`,
        value: `${value}`,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
    });
}

async function createUser(payload: TokenPayload) {
    try {
        await new kvu({
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
        }).save();
    } catch (error) {
        console.log(error);
    }
}

function createAccessToken(id: string) {
    return new SignJWT({ user_id: id })
        .setProtectedHeader({
            alg: "HS256",
        })
        .setIssuedAt()
        .setExpirationTime("10 minutes")
        .sign(ACCESS_TOKEN_SECRET);
}

async function decryptAccessToken(
    token: string
): Promise<tokenReturn<NJWTPayload>> {
    try {
        const { payload }: { payload: NJWTPayload } = await jwtVerify(
            token,
            ACCESS_TOKEN_SECRET,
            {
                algorithms: ["HS256"],
            }
        );

        return {
            error: null,
            data: payload,
        };
    } catch (error) {
        return {
            error: "decrypt error",
            data: null,
        };
    }
}

function createRefreshToken(id: string, version: string) {
    return new SignJWT({ user_id: id, tokenversion: version })
        .setProtectedHeader({
            alg: "HS256",
        })
        .setIssuedAt()
        .setExpirationTime("3 days")
        .sign(REFRESH_TOKEN_SECRET);
}

async function decryptRefreshToken(
    token: string
): Promise<tokenReturn<NJWTPayload>> {
    try {
        const { payload }: { payload: NJWTPayload } = await jwtVerify(
            token,
            ACCESS_TOKEN_SECRET,
            {
                algorithms: ["HS256"],
            }
        );

        return {
            error: null,
            data: payload,
        };
    } catch (error) {
        return {
            error: "decrypt error",
            data: null,
        };
    }
}

export async function loginBack(token: string) {
    const payload = await verifyToken(token);
    await dbConnect();
    if (payload === undefined) {
        redirect("/");
    }

    let user = (await kvu.findOne({
        email: payload.email,
    })) as userType | null;

    if (!user) {
        await createUser(payload);
        user = (await kvu.findOne({
            email: payload.email,
        })) as userType;
    }

    const accesstoken = await createAccessToken(user._id.toString());
    const refreshtoken = await createRefreshToken(
        user._id.toString(),
        user.tokenversion
    );

    setCookie("tike", accesstoken);
    setCookie("besi", refreshtoken);
}

type homeType = {
    isAuth: boolean;
}

export async function getHome() {
    const cookiesStore = cookies();
    const tike = cookiesStore.get("tike");
    const besi = cookiesStore.get("besi");

    if (!tike || !besi) {
        return { isAuth: false };
    }
    const accesstoken = await decryptAccessToken(tike.value);

    if (accesstoken.data) {
        const user_id = accesstoken.data.user_id;
        const user = await kvu.findOne({ _id: user_id });
    }

    /* access token expire use refresh token */
    const refreshtoken = await decryptRefreshToken(besi.value)

    if (refreshtoken.data) {
        /* create access token and refresh refresh token */
        /* check refresh token in database */
        const user_id = refreshtoken.data.user_id
        const token = refreshtoken.data.tokenversion!
        const user = await kvu.findOne({_id:user_id}) as userType

        if (token === user.tokenversion ) {

        }
    }

    /* invalid accesstoken and refresh token */
    return { isAuth: true };
}
