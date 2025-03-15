import Link from "next/link";

const menus = [
  {
    page: "Dashboard",
    link: "/",
  },
  {
    page: "Contaract Management",
    link: "/contract-management",
  },
  {
    page: "Buyer Management",
    link: "/buyer",
  },
  {
    page: "Seller Management",
    link: "/seller",
  },
];

const Sidebar = () => {
  return (
    <div>
      <div className="">
        <div className="pt-24">
          <div className="flex items-center gap-3">
            <div className="border border-green-500 px-3 py-2 rounded font-bold">
                W
            </div>
            <p>William josh</p>
          </div>
        </div>
        <div className="pt-7">
          {menus.map((menu, idx) => (
            <li key={idx} className="list-none mb-4">
              <Link href={menu.link}>{menu.page}</Link>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
