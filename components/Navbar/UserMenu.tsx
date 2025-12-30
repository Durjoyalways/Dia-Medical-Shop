import Link from "next/link";

const UserMenu = () => {
  return (
    <ul className="menu menu-sm dropdown-content mt-4 z-[100] p-2 shadow-2xl bg-[#1e293b] border border-slate-700 rounded-xl w-60 backdrop-blur-lg">
      <li className="menu-title text-emerald-500 font-bold uppercase tracking-tighter border-b border-slate-700 mb-2 pb-1">
        Customer Account
      </li>
      
      <li>
        <Link href="/profile" className="py-3 text-gray-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all font-medium">
          <span className="text-emerald-500">👤</span> My Profile
        </Link>
      </li>
      
      <li>
        <Link href="/orders" className="py-3 text-gray-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all font-medium">
          <span className="text-emerald-500">📦</span> Order History
        </Link>
      </li>
      
      <div className="h-[1px] bg-slate-700 my-1"></div>
      
      <li>
        <button className="py-3 text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold">
          <span className="mr-1">Logout</span> 
        </button>
      </li>
    </ul>
  );
};

export default UserMenu;