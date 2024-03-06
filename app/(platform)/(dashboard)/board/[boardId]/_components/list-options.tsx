"use client";

import { List } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, XCircle } from "lucide-react";
import { FormSubmit } from "@/components/forms/form-submit";
import { Separator } from "@/components/ui/separator";
import { deleteList } from "@/actions/delete-list";
import { useAction } from "@/hooks/user-action";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import { copyList } from "@/actions/copy-list";

interface ListOptions {
  onAddCard: () => void;
  data: List;
}

const ListOptions = ({ onAddCard, data }: ListOptions) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  const { execute: executeDeleteList } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} successfully deletee`);
      closeRef.current?.click();
    },
    onError: (err) => {
      toast.error(`${err}`);
    },
  });

  const { execute: execiteCopyList } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} successfully deletee`);
      closeRef.current?.click();
    },
    onError: (err) => {
      toast.error(`${err}`);
    },
  });

  const onCopy = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    execiteCopyList({ id, boardId });
  }

  const onDelete = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeDeleteList({ id, boardId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Add card...
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input
            hidden
            name="boardId"
            id="boardId"
            defaultValue={data.boardId}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Copy list...
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDelete}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input
            hidden
            name="boardId"
            id="boardId"
            defaultValue={data.boardId}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Delete this list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default ListOptions;
