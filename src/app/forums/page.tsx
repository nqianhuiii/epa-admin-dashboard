import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ForumTable } from "@/components/forum-table";
import { getAllPosts } from "@/services/forumService";
import { Metadata } from "next";

export const dynamic = 'force-dynamic'; 

export const metadata: Metadata = {
  title: "Forum",
};

const TablesPage = async() => {

  const posts = await getAllPosts();
  return (
    <>
      <Breadcrumb pageName="Forum" />

      <div className="space-y-10">
        <ForumTable posts= {posts} />
      </div>
    </>
  );
};

export default TablesPage;
