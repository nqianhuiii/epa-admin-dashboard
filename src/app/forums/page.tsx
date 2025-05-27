import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ForumTable } from "@/components/Tables/forum-table";
import { getAllPosts } from "@/services/forumService";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forum",
};

const TablesPage = async() => {

  const posts = await getAllPosts();
  return (
    <>
      <Breadcrumb pageName="Users" />

      <div className="space-y-10">
        <ForumTable posts= {posts} />
      </div>
    </>
  );
};

export default TablesPage;
