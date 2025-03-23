"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import { MdOutlineLogout } from "react-icons/md";
import { useState } from "react"; // Import useState
import { FaBars } from "react-icons/fa"; // Import hamburger icon

const menus = [
  {
    page: "Dashboard",
    link: "/",
  },
  {
    page: "Contract Management",
    link: "/contract-management",
  },
  {
    page: "Buyer Management",
    link: "/buyer-management",
  },
  {
    page: "Seller Management",
    link: "/seller-management",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

  const handleLogout = () => {
    console.log("User logged out");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when a menu item is clicked
  const handleMenuItemClick = () => {
    if (isSidebarOpen) {
      toggleSidebar(); // Close the sidebar on mobile
    }
  };

  return (
    <>
      {/* Mobile Menu Icon */}
      <div className="lg:hidden fixed top-5 left-5 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative lg:w-[15%] w-[70%] h-screen shadow-right border-r border-gray-200 bg-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0 z-20" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-screen px-2 flex flex-col justify-between">
          <div>
            {/* Logo and User Info */}
            <div className="pt-24">
              <Link
                href={"/"}
                className="flex items-center justify-center gap-3"
                onClick={handleMenuItemClick} // Close sidebar on mobile
              >
                <div className="border border-green-500 px-3 py-2 rounded font-bold">
                  W
                </div>
                <p>William Josh</p>
              </Link>
            </div>

            {/* Menu Links */}
            <div className="pt-7">
              {menus.map((menu, idx) => (
                <li key={idx} className="list-none mb-4">
                  <Link
                    href={menu.link}
                    className={`flex items-center justify-center px-5 pb-2 transition-all ${
                      pathname === menu.link
                        ? "shadow-md" // Active tab styles
                        : "text-gray-700 hover:bg-gray-100" // Inactive tab styles
                    }`}
                    onClick={handleMenuItemClick} // Close sidebar on mobile
                  >
                    {menu.page}
                  </Link>
                </li>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="pb-10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
            >
              <MdOutlineLogout />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;