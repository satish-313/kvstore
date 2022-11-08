import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-cyan-500">
      <div className="max-w-5xl mx-auto px-3 py-3 flex justify-between items-center">
        <Link href="/">
          <h4 className="text-2xl text-gray-700 font-semibold">My env store</h4>{" "}
        </Link>
        <div className="flex items-center space-x-4">
          <img className="cursor-pointer h-10 w-10 md:h-16 md:w-16" src="/user.png" alt="use" />
          <span className="text-sm md:text-md font-semibold cursor-pointer">Logout</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
