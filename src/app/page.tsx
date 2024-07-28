import { HydrateClient } from "~/trpc/server";
import Image from "next/image";

export default async function Home() {

  return (
    <HydrateClient>
      <>
        {" "}
        <section className="my-4 flex flex-col p-6 md:flex-row md:justify-evenly">
          <div>
            <p className="mb-2 text-2xl font-semibold text-green-600">
              Welcome to protected key value store.
            </p>
            <p className="font-mono text-lg text-gray-400">
              Easy to access store in secure encrypt, feel free to store your
              key information like, env variable or username and password.
            </p>
          </div>
          <div>
            <Image
              unoptimized
              className="mx-auto block"
              src="/lock.gif"
              width={250}
              height={250}
              alt="lock image"
            />
          </div>
        </section>
      </>
    </HydrateClient>
  );
}
