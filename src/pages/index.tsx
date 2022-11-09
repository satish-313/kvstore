import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Loading } from "../components";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const router = useRouter();
  const Iam = trpc.Iam.useQuery();

  if (Iam.isLoading) return <Loading />;
  if (!Iam.isSuccess) {
    router.replace("/auth");
  }

  return (
    <div className="">
      <h4>Hello ,{Iam.data?.user?.name}</h4>
      <div className="py-5"></div>
    </div>
  );
};

export default Home;
