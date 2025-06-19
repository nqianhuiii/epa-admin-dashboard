import { TrashIcon } from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { DownloadIcon, PreviewIcon } from "./icons";
import Image from "next/image";

import { AppUser } from "@/services/userSercvice";
import { DeleteUserForm } from "@/components/DeleteUserForm";

export async function UserTable({users}: {users: AppUser[]}) {

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead className="min-w-[155px] xl:pl-7.5">Fullname</TableHead>
            <TableHead>User Name</TableHead>
             <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            {/* <TableHead>Phone Number</TableHead> */}
            <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((item, index) => (
            <TableRow key={item.id} className="border-[#eee] dark:border-dark-3">
              <TableCell className="xl:pl-7.5 flex min-w-fit items-center gap-3">
                <Image
                  // src={item.profilePicture || "/images/avatar.png"}
                  src={ "/images/user/user-03.png"}
                  className="size-8 rounded-full object-cover"
                  width={40}
                  height={40}
                  alt={item.fullName + " Logo"}
                />
                <h5 className="text-dark dark:text-white">{item.fullName}</h5>
              </TableCell>

              <TableCell>
                <h5 className="text-dark dark:text-white">{item.userName}</h5>
              </TableCell>

              <TableCell>
                <h5 className="text-dark dark:text-white">{item.email}</h5>
              </TableCell>

              <TableCell>
                <p className="text-dark dark:text-white">
                  {dayjs(item.createdAt).format("MMM DD, YYYY")}
                </p>
              </TableCell> 

              <TableCell className="xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  {/* <button className="hover:text-primary">
                    <span className="sr-only">View User</span>
                    <PreviewIcon />
                  </button> */}

                  <DeleteUserForm
                    userId={item.id}
                    userName={item.fullName}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
