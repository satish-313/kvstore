const envdata = [
  {
    name: "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
    value:
      "368662961806-c8f2hsectd7urdaiq24dr4n86scbda19.apps.googleusercontent.com",
  },
  {
    name: "REFRESH_TOKEN_SECRET",
    value: "refresh token secret keep in mind",
  },
  {
    name: "ACCESS_TOKEN_SECRET",
    value: "access token secret keep in mind",
  },
];

const Project = () => {
  return (
    <div className="drop-shadow-lg w-full">
      <h4 className="text-xl font-semibold text-gray-700 pb-3">Env store</h4>
      {envdata.map((p, i) => (
        <div key={i} className="grid sm:grid-cols-3 gap-x-4 gap-y-1 pb-3">
          <div className="sm:col-span-1 overflow-hidden">
            <pre>{p.name}</pre>
          </div>
          <div className="sm:col-span-2 overflow-hidden">
            <pre>{p.value}</pre>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Project;
