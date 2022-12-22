import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-cyan-500">
      <div className="max-w-5xl mx-auto px-3 py-1 flex justify-between items-center">
        <Link href="/">
          <h4 className="text-2xl text-gray-700 font-bold font-mono">Env store</h4>{" "}
        </Link>
        <div className="flex items-center space-x-4">
          <img className="cursor-pointer h-8 w-8 md:h-14 md:w-14" src="/user.png" alt="use" />
        </div>
      </div>
    </header>
  );
};

export default Header;
