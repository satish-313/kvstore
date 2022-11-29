import { FC } from "react";
import { AiFillDelete } from "react-icons/ai";
import { envProject } from "../server/model/envUser";

const Project: FC<{ projects?: envProject[] }> = ({ projects }) => {
  return (
    <div>
      {projects?.map((p, i) => (
        <div
          key={i}
          className="px-4 py-1 mb-4 border border-4 border-indigo-600  rounded-lg"
        >
          <div>
            <span className="text font-bold text-gray-700 mr-3">
              Project Name -
            </span>
            <span className="text font-semibold text-gray-700 pb-3">
              {p.projectName}
            </span>
          </div>
          <div>
            <span className="text font-bold text-gray-700 mr-3">
              Github Link -
            </span>
            <span className="text font-semibold text-gray-700 pb-3">
              {p.githubName}
            </span>
          </div>
          {p.secrets?.map((s, idx) => (
            <div key={idx} className="grid sm:grid-cols-3">
              <div className="sm:col-span-1 py-2 overflow-hidden">
                <pre className="">{Object.keys(s)[0]}</pre>
              </div>
              <div className="sm:col-span-2 py-2 overflow-hidden">
                <pre className="">{Object.values(s)[0]}</pre>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Project;
