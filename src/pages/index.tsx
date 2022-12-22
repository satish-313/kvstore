import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Loading, MainModal, Projects, Signup } from "../components";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [toggle, setToggle] = useState(false);
  const [signup, setSignup] = useState(false);
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

  const signupModal = (AfterLogin ?:boolean) => {
    setSignup(!signup);
    if(AfterLogin) {
      router.reload()
    }
  };

  const addProject = (data: any) => {
    AddProject.mutate(data);
  };

  const deleteProject = (_id: any) => {
    DeleteProject.mutate({ _id });
  };

  if (Iam.isLoading) return <Loading />;

  if (Iam.isError) {
    router.push("/500");
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
            <hr className="my-2" />

            <div className="border rounded-lg drop-shadow-lg mb-3">
              {Iam.data.user?.projects?.map((p, idx) => (
                <Projects key={idx} p={p} deleteProject={deleteProject} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="py-4">
          <h3 className="font-mono font-semibold text-gray-700 ">
            Welcome to protected store to storing environment{" "}
          </h3>
          <div className="grid grid-cols-4 gap-10">
            <p className="mt-4 font-semibold text-green-700 col-span-4 sm:col-span-3">
              Hey, fellow it's an free and opensource site to store your
              sensetive environment variable without any worries. I garrenty
              full security. You can store variable similar to .env file
            </p>
            <div className="hidden sm:block col-span-1">
              <img className="rounded" src="./lock.gif" alt="" />
            </div>
          </div>

          {signup ? <Signup signupModal={signupModal} /> : null}

          <div className="mt-4">
            <button
              onClick={() => signupModal()}
              className="bg-pink-700 hover:bg-red-700 py-2 px-4 block mx-auto font-semibold text-white rounded"
            >
              signup or singin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
