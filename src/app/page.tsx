import Login from "@/component/login";
import { getHome } from "@/lib/query";

export default async function Home() {
    const data = await getHome();
    return <div>{data.isAuth ? "hello" : <UnAuth />}</div>;
}

function UnAuth() {
    return (
        <section>
            <div className="grid md:grid-cols-6 gap-4 mt-12">
                <div className="md:col-span-4 ">
                    <p className="text-gray-900 text-2xl font-medium leading-9 tracking-wider">
                        Welcome to Secure Key value store.
                    </p>
                    <p className="text-gray-700 text-lg underline mt-4">
                        Effortless Key-Value Storage for Developers.
                    </p>
                    <p className="text-slate-700 text-lg mt-4 tracking-wide">
                        "Securely store and manage your key-value pairs with
                        ease. Build faster, simplify data storage, and focus on
                        what really matters."
                    </p>
                    <p className="text-slate-900 font-bold tracking-widest leading-10 text-xl mt-8 capitalize">
                        With single click upload .env/.json file 👈
                    </p>
                </div>
                <div className="flex justify-center md:col-span-2">
                    <img src="./lock.gif" alt="lok" />
                </div>
            </div>
            <Login />
        </section>
    );
}
