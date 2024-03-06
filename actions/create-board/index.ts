"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, image } = data;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHtml, imageUserName] =
    image.split("|");


  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHtml ||
    !imageUserName
  ) {
    return {
      error: "Missing Fields",
    };
  }

  let board;
  try {
    board = await db.board.create({
      data: {
        title: title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHtml,
      },
    });
  } catch (err) {
    return {
      error: "Failed to create. Internal Server Error",
    };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);

// const testingPromise = async (): Promise<ReturnType> => {
//   return Promise.resolve({
//     fieldErrors: {},
//     error: "2",
//     data: {
//       id: "1",
//       title: "1",
//     },
//   });
// };

// let testing = createSafeAction(CreateBoard, testingPromise);

const testing = async (): Promise<number> => {
  return Promise.resolve(1);
};

testing();
