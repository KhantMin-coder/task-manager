"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { deleteBoard } from "@/actions/delete-board";
import { MoreHorizontal, XCircle } from "lucide-react";
import { useAction } from "@/hooks/user-action";
import { toast } from "sonner";



interface BoardOptionsProps {
  id: string;
}

export const BoardOptions = ({ id }: BoardOptionsProps) => {

  const {execute, loading} = useAction(deleteBoard , {
    onSuccess:(data) => {

    },
    onError:(err) => {
      toast.error(err)
    }
  })

  const onDelete = ()=>{
    execute({id})
  }


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board Actions
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          onClick={onDelete}
          disabled={loading}
          className="rounded-none w-full h-auto p-2 px-5 justfy-start font-normal text-sm"
        >
          Delete Board
        </Button>
      </PopoverContent>
    </Popover>
  );
};
