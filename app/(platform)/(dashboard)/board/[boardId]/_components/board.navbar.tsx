import { Board } from "@prisma/client";
import BoardTitleForm from "./board-title-form";
import { BoardOptions } from "./board-options";

interface BoardNavbarProps {
  board: Board;
}

const BoardNavbar = async ({ board }: BoardNavbarProps) => {
  return (
    <div className="w-full h-14 z-[50] bg-black/50 fixed top-14 flex items-center px-6 gap-x-6 text-white">
      <BoardTitleForm data={board} />
      <div className="ml-auto">
        <BoardOptions id={board.id}/>
      </div>
    </div>
  );
};

export default BoardNavbar;
