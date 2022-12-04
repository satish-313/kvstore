import { FC, FormEvent, useReducer, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { envProject, secretType } from "../server/model/envUser";
import { trpc } from "../utils/trpc";

interface Props {
  p: envProject;
  deleteProject: (data: any) => void;
}

type projectAction =
  | {
      type: "setProjectName";
      payload: string;
    }
  | { type: "setGithubName"; payload: string }
  | { type: "addKey" }
  | { type: "setSecretKey"; payload: { idx: number; value: string } }
  | { type: "setSecretValue"; payload: { idx: number; value: string } };

interface reducerState {
  project: envProject;
}

const Project: FC<Props> = ({ p, deleteProject }) => {
  const saveProject = trpc.addProject.useMutation();
  const [isEdit, setIsEdit] = useState(false);
  const [state, dispatch] = useReducer(
    (state: reducerState, action: projectAction) => {
      switch (action.type) {
        case "setProjectName":
          return {
            project: { ...state.project, projectName: action.payload },
          };
        case "setGithubName":
          return {
            project: { ...state.project, githubName: action.payload },
          };
        case "addKey":
          return {
            project: {
              ...state.project,
              secrets: [...state.project?.secrets!, {}],
            },
          };
        case "setSecretKey":
          let secretKey = action.payload.value;
          let idx = action.payload.idx;
          if (state.project.secrets) {
            let secret = state.project.secrets[idx];
            let secretValue = Object.values(secret)[0];
            secretValue = secretValue ? secretValue : "";
            let temp: secretType = {};
            temp[secretKey] = secretValue;
            state.project.secrets[idx] = temp;
          }
          return {
            project: {
              ...state.project,
            },
          };
        case "setSecretValue":
          let secretValue = action.payload.value;
          let id = action.payload.idx;
          if (state.project.secrets) {
            let secret = state.project.secrets[id];
            let secretKey = Object.keys(secret)[0];
            let temp: secretType = {};
            temp[secretKey] = secretValue;
            state.project.secrets[id] = temp;
          }
          return {
            project: {
              ...state.project,
            },
          };
        default:
          return { ...state };
      }
    },
    { project: p }
  );

  const saveProjectFn = (e: FormEvent) => {
    e.preventDefault();
    const { projectName, githubName, _id, secrets } = state.project;
    saveProject.mutate({
      projectName,
      githubName: githubName ? githubName : null,
      secrets: secrets ? secrets : null,
      _id: _id!.toString()
    });
  };

  return (
    <div>
      <div className="px-4 py-1 mb-4 border border-4 border-indigo-600  rounded-lg">
        <div className="flex space-x-3 justify-end items-center">
          <FaEdit
            onClick={() => setIsEdit(!isEdit)}
            size={20}
            className="text-gray-700 cursor-pointer"
          />
          <FaTrash
            onClick={() => deleteProject(state.project?._id)}
            size={18}
            className="text-red-700 cursor-pointer"
          />
        </div>
        <form onSubmit={(e) => saveProjectFn(e)}>
          <div className="grid sm:grid-cols-5 gap-x-3">
            <span className="text font-bold text-gray-700 mr-3 sm:col-span-1 overflow-hidden">
              Project Name -
            </span>
            {isEdit ? (
              <input
                className="sm:col-span-4  overflow-hidden mb-3 rounded w-full "
                type="text"
                placeholder="project name"
                defaultValue={state?.project.projectName}
                onChange={(e) =>
                  dispatch({ type: "setProjectName", payload: e.target.value })
                }
              />
            ) : (
              <span className="text sm:col-span-4 font-semibold text-gray-700 mb-3">
                {state.project?.projectName}
              </span>
            )}
          </div>
          <div className="grid sm:grid-cols-5 gap-x-3">
            <span className="text font-bold text-gray-700 mr-3 sm:col-span-1">
              Github Link -
            </span>
            {isEdit ? (
              <input
                defaultValue={state.project?.githubName}
                className="overflow-hidden rounded mb-3 sm:col-span-4"
                type="text"
                placeholder="github name"
                onChange={(e) =>
                  dispatch({ type: "setGithubName", payload: e.target.value })
                }
              />
            ) : (
              <span className="text font-semibold text-gray-700 mb-3 sm:col-span-4">
                {state.project?.githubName}
              </span>
            )}
          </div>
          {state.project?.secrets?.map((s, idx) => (
            <div key={idx} className="grid sm:grid-cols-5 gap-x-3">
              <div className="sm:col-span-1 py-2 overflow-hidden">
                {isEdit ? (
                  <input
                    className="w-full"
                    defaultValue={Object.keys(s)[0]}
                    data-key={idx}
                    onChange={(e) =>
                      dispatch({
                        type: "setSecretKey",
                        payload: {
                          idx: parseInt(e.currentTarget.dataset.key!),
                          value: e.target.value,
                        },
                      })
                    }
                  />
                ) : (
                  <pre className="">{Object.keys(s)[0]}</pre>
                )}
              </div>
              <div className="sm:col-span-4 py-2 overflow-hidden">
                {isEdit ? (
                  <input
                    className="w-full"
                    defaultValue={Object.values(s)[0]}
                    data-secret={idx}
                    onChange={(e) =>
                      dispatch({
                        type: "setSecretValue",
                        payload: {
                          idx: parseInt(e.currentTarget.dataset.secret!),
                          value: e.target.value,
                        },
                      })
                    }
                  />
                ) : (
                  <pre className="">{Object.values(s)[0]}</pre>
                )}
              </div>
            </div>
          ))}

          {isEdit ? (
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-green-500 m-1 px-2 py-1 rounded hover:bg-green-700 text-gray-700 font-semibold"
                onClick={(e) => dispatch({ type: "addKey" })}
              >
                Add field
              </button>
              <button
                type="submit"
                className="bg-green-500 m-1 px-2 py-1 rounded hover:bg-green-700 text-gray-700 font-semibold"
              >
                Save
              </button>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default Project;
