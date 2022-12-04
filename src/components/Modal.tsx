import {
  FC,
  useRef,
  useState,
  MouseEvent,
  FormEvent,
  ChangeEvent,
} from "react";

type secretType = {
  [key: string]: string;
};

const MainModal: FC<{
  modalToggle: () => void;
  addProject: (data: any) => void;
}> = ({ modalToggle, addProject }) => {
  const [close, setClose] = useState(false);
  const [secrets, setSecrets] = useState<secretType[]>([]);
  const ModalBackground = useRef(null);
  const projectName = useRef<HTMLInputElement>(null);
  const githubName = useRef<HTMLInputElement>(null);

  const closeHelper = async () => {
    setClose(true);
    await new Promise((r) => setTimeout(r, 1000));
    modalToggle();
  };

  const closeModalBackground = (e: MouseEvent) => {
    if (ModalBackground.current === e.target) {
      closeHelper();
    }
  };

  const secretChange = (e: ChangeEvent<HTMLInputElement>) => {
    const obj = e.currentTarget.dataset;
    const keyType = Object.keys(obj)[0];

    if (keyType === "key") {
      const idx = parseInt(obj.key!);
      const key = e.target.value;
      const s: secretType = {};
      s[key] = secrets[idx].key ? secrets[idx].key : "";
      secrets[idx] = s;
      setSecrets([...secrets]);
    } else if (keyType === "secret") {
      const idx = parseInt(obj.secret!);
      const value = e.target.value;
      const s: secretType = {};
      const key = Object.keys(secrets[idx])[0];
      if (key === undefined) return
      s[key] = value;
      secrets[idx] = s;
      setSecrets([...secrets]);
    }
  };

  const AddKey = () => {
    setSecrets([...secrets, {}]);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const pName = projectName.current?.value;
    const gName = githubName.current?.value;
    const data = { githubName: gName, projectName: pName, secrets, _id: null };
    addProject(data);
    closeHelper();
  };

  return (
    <div
      ref={ModalBackground}
      onClick={(e) => closeModalBackground(e)}
      className="absolute inset-0 z-10 flex flex-col items-center"
    >
      <div className="h-1/5" />
      <div
        className={`bg-cyan-400 w-9/12 sm:w-2/3 p-3 rounded-lg relative modal-body-animation ${
          close ? "modal-body-animation-close" : ""
        }`}
      >
        <button
          onClick={closeHelper}
          className="absolute top-0 right-0 text-xl font-semibold text-black px-3 hover:text-red-600"
        >
          X
        </button>
        <div className="py-3" />
        <form onSubmit={submit}>
          <div className="grid sm:grid-cols-4 gap-x-3 mb-2">
            <div className="sm:col-span-1 overflow-hidden">
              <label className="block font-semibold text-gray-700">
                Project Name
              </label>
            </div>
            <div className="sm:col-span-3">
              <input
                ref={projectName}
                className="block w-full outline-none overflow-hidden p-1 rounded"
                type="text"
                placeholder="project name"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-x-3 mb-2">
            <div className="sm:col-span-1 overflow-hidden">
              <label className="block font-semibold text-gray-700">
                Github Name
              </label>
            </div>
            <div className="sm:col-span-3">
              <input
                ref={githubName}
                className="block w-full outline-none overflow-hidden p-1 rounded"
                type="text"
                placeholder="github name"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={AddKey}
            className="px-3 mb-2 py-1.5 rounded-full bg-gray-500 hover:bg-gray-700 text-white font-semibold"
          >
            +
          </button>
          {secrets.map((s, idx) => {
            return (
              <div key={idx}>
                <div className="grid sm:grid-cols-4 gap-x-3 mb-2">
                  <div className="sm:col-span-1 overflow-hidden">
                    <input
                      className="block w-full outline-none overflow-hidden p-1 rounded"
                      type="text"
                      placeholder="key name"
                      data-key={idx}
                      onChange={(e) => secretChange(e)}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      className="block w-full outline-none overflow-hidden p-1 rounded"
                      type="text"
                      placeholder="value name"
                      data-secret={idx}
                      onChange={(e) => secretChange(e)}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <button
            className="block mx-auto border px-2 py-1 rounded bg-red-400 hover:bg-red-600 font-semibold text-gray-800"
            type="submit"
          >
            submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainModal;
