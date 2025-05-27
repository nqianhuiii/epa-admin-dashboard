import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { UserTable } from "@/components/Tables/user-table";
import { getAllUsers } from "@/services/userSercvice";
// import { TopChannels } from "@/components/Tables/top-channels";
// import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
// import { TopProducts } from "@/components/Tables/top-products";
// import { TopProductsSkeleton } from "@/components/Tables/top-products/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Users",
};

const TablesPage = async() => {

  const users = await getAllUsers();
  return (
    <>
      <Breadcrumb pageName="Users" />

      <div className="space-y-10">
        {/* <Suspense fallback={<TopChannelsSkeleton />}>
          <TopChannels />
        </Suspense> */}
{/*         
        <Suspense fallback={<TopProductsSkeleton />}>
          <TopProducts />
        </Suspense> */}

        <UserTable users= {users} />
      </div>
    </>
  );
};

export default TablesPage;
