import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { UserTable } from "@/components/user-table";
import { getAllUsers } from "@/services/userSercvice";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
};

const TablesPage = async() => {

  const users = await getAllUsers();
  return (
    <>
      <Breadcrumb pageName="Users" />

      <div className="space-y-10">
        <UserTable users= {users} />
      </div>
    </>
  );
};

export default TablesPage;
