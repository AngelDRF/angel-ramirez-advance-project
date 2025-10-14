"use client";

import { usePathname } from "next/navigation";
import Searchbar from "./SearchBar";
import Sidebar from "./SideBar";

const Bar = () => {
  const pathname = usePathname();

  const isRootOrChoosePlan =
    pathname === "/" || pathname === "/choose-planPage";

  return (
    <>
      {!isRootOrChoosePlan && <Searchbar />}
      {!isRootOrChoosePlan && <Sidebar />}
    </>
  );
};

export default Bar;
