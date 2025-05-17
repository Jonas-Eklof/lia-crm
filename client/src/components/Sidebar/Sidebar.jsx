import { UsersIcon, LogOutIcon } from "lucide-react";

export default function Sidebar({ activeView, setActiveView }) {
  const menuItems = [
    {
      id: "companies",
      label: "Företag",
      icon: UsersIcon,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="sidebar-header p-4 border-b border-gray-200">
        <h1 className="text-2xl pl-2 font-bold text-gray-700">LIA-CRM</h1>
      </div>

      <nav className="flex-1 pt-4">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center font-bold w-full px-6 py-3 text-left ${
                    activeView === item.id
                      ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} className="mr-3 " />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4 text-gray-600 hover:text-blue-600 cursor-pointer">
          <LogOutIcon size={18} className="mr-3" />
          <span>Log Out</span>
        </div>
      </div> */}
    </aside>
  );
}
