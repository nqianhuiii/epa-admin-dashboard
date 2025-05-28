"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { PreviewIcon } from "./icons";

import { TrashIcon } from "@/assets/icons";
import { AppPost } from "@/services/forumService";
import { useState } from "react";
import PostModal from "../PostModal";

export function ForumTable({posts}: {posts: AppPost[]}) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<AppPost | null>(null);

    const handleViewPost = (post: AppPost) => {
    setSelectedPost(post);
    setOpenModal(true);
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[155px] xl:pl-7.5">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Posted By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Comments</TableHead>
            {/* <TableHead>Phone Number</TableHead> */}
            <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {posts.map((item, index) => (
            <TableRow key={item.id} className="border-[#eee] dark:border-dark-3">
              <TableCell className="xl:pl-7.5 flex min-w-fit items-center gap-3">
                {/* <Image
                  // src={item.profilePicture || "/images/avatar.png"}
                  src={ "/images/user/user-03.png"}
                  className="size-8 rounded-full object-cover"
                  width={40}
                  height={40}
                  alt={item.title + " Logo"}
                /> */}
                <h5 className="text-dark dark:text-white">{item.title}</h5>
              </TableCell>

              <TableCell>
                <h5 className="text-dark dark:text-white">{item.description}</h5>
              </TableCell>

              <TableCell>
                <h5 className="text-dark dark:text-white">{item.username}</h5>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">
                  {dayjs(item.createdAt).format("MMM DD, YYYY")}
                </p>
              </TableCell> 

              <TableCell>
                <h5 className="text-dark dark:text-white">{item.likedBy?.length ?? 0}</h5>
              </TableCell>

              <TableCell>
                <h5 className="text-dark dark:text-white">{item.commentCount}</h5>
              </TableCell>              
            

              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button 
                    className="hover:text-primary" 
                    onClick={() => handleViewPost(item)}
                  >
                    <span className="sr-only">View Post</span>
                    <PreviewIcon />
                  </button>
                  <button className="hover:text-primary">
                    <span className="sr-only">Delete Post</span>
                    <TrashIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {openModal && selectedPost && (<PostModal post={selectedPost} onClose={() => setOpenModal(false)} />)}

    </div>
  );
}
