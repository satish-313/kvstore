import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Loading } from "../components";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const router = useRouter();
  const Iam = trpc.Iam.useQuery();
  const helloMe = trpc.helloMe.useMutation();

  if (Iam.isLoading) return <Loading />;
  if (Iam.error) {
    router.replace("/auth");
  }
  if (Iam.data?.isAuth === false) {
    router.replace("/auth");
  }

  const action = () => {
    helloMe.mutate();
  };

  return (
    <div className="">
      <h4>Hello ,{Iam.data?.user?.name}</h4>
      <div className="py-5"></div>
      <p>is auth :{helloMe.data?.position}</p>
      <button onClick={() => action()}> check is auth</button>
    </div>
  );
};

export default Home;
