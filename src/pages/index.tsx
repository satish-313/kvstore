import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Loading, MainModal, Projects } from "../components";
import { setAccessToken } from "../utils/context";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [toggle, setToggle] = useState(false);
  const router = useRouter();
  const Iam = trpc.Iam.useQuery();
  const AddProject = trpc.addProject.useMutation({
    onSuccess() {
      Iam.refetch();
    },
  });
  const DeleteProject = trpc.deleteProject.useMutation({
    onSuccess() {
      Iam.refetch();
    },
  });

  const modalToggle = () => {
    setToggle(!toggle);
  };

  const addProject = (data: any) => {
    AddProject.mutate(data);
  };

  const deleteProject = (data: any) => {
    DeleteProject.mutate(data)
  };

  if (Iam.isError) {
    router.push("/500");
  }

  if (Iam.data?.isAuth === false) {
    router.replace("/auth");
  }

  if (Iam.isLoading) return <Loading />;
  if (Iam.data?.accessToken) {
    const AT = Iam.data.accessToken;
    if (AT.length > 1) {
      setAccessToken(Iam.data?.accessToken);
    }
  }

  return (
    <div>
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
            {toggle ? (
              <MainModal modalToggle={modalToggle} addProject={addProject} />
            ) : null}
            <hr className="mt-2" />

            <div className="py-2" />
            <div className="border rounded-lg drop-shadow-lg mb-3">
              <Projects projects={Iam.data.user?.projects} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Home;
