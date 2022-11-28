import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Loading, MainModal, Project } from "../components";
import { setAccessToken } from "../utils/context";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [toggle, setToggle] = useState(false);
  const router = useRouter();
  const Iam = trpc.Iam.useQuery();
  const AddProject = trpc.addProject.useMutation()

  const modalToggle = () => {
    setToggle(!toggle);
  };

  // const addProject = async(data) => {
  //   AddProject.mutate(data)
  // }

  if (Iam.isLoading) return <Loading />;
  if (Iam.data?.isAuth === false || Iam.isError) {
    router.replace("/auth");
  }

  if (Iam.data?.accessToken) setAccessToken(Iam.data.accessToken);

  return (
    <div className="">
      <Head>
        <title>Env store</title>
      </Head>
      {Iam.data?.isAuth ? (
        <>
          <div className="py-4" />
          <div>
            <div className="flex">
              <h4 className="text-gray-700 rounded-lg font-bold  px-2 mr-5">
                Projects
              </h4>
              <button
                className=" text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-2 py-1.5"
                type="button"
                data-modal-toggle="defaultModal"
                onClick={() => setToggle(!toggle)}
              >
                Add Project
              </button>
            </div>
            {toggle ? <MainModal modalToggle={modalToggle} /> : null}
            <hr className="mt-2" />

            <div className="py-2" />
            <div className="border rounded-lg bg-pink-200 p-4 drop-shadow-lg mb-3">
              <Project />
            </div>
            <div className="border rounded-lg bg-pink-200 p-4 drop-shadow-lg mb-3">
              <Project />
            </div>
            <div className="border rounded-lg bg-pink-200 p-4 drop-shadow-lg mb-3">
              <Project />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Home;
