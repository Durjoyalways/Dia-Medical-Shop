import Link from "next/link";

const NavLinks = () => {
  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Medicines", path: "/medicines" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" }, // Flash Sale সরিয়ে এখানে Contact দেওয়া হয়েছে
  ];

  return (
    <>
      {publicLinks.map((link) => (
        <li key={link.name} className="list-none">
          <Link
            href={link.path}
            className="relative text-sm font-bold tracking-[0.1em] text-gray-300 hover:text-emerald-400 transition-all duration-300 group py-2"
          >
            {link.name}
            {/* প্রিমিয়াম হোভার আন্ডারলাইন ইফেক্ট */}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-500 group-hover:w-full"></span>
          </Link>
        </li>
      ))}
    </>
  );
};

export default NavLinks;