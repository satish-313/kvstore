import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Loading } from "../components";
import { setAccessToken } from "../utils/context";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const router = useRouter();
  const Iam = trpc.Iam.useQuery();

  if (Iam.isLoading) return <Loading />;
  if (!Iam.isSuccess || Iam.isError) {
    router.replace("/auth");
  }

  if (Iam.data?.accessToken) setAccessToken(Iam.data.accessToken);

  return (
    <div className="">
      <h4>Hello ,{Iam.data?.user?.name}</h4>
      <div className="py-5"></div>
    </div>
  );
};

export default Home;
