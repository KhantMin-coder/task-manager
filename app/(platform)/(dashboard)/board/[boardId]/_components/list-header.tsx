"use client";

import { updateList } from "@/actions/update-list";
import FormInput from "@/components/forms/form-input";
import { useAction } from "@/hooks/user-action";
import { List } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import ListOptions from "./list-options";

interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
}

const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
  const [editing, isEditing] = useState(false);
  const [title, setTitle] = useState(data.title);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    isEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    isEditing(false);
  };

  const { execute, fieldErrors } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`List updated to ${data.title}`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (err) => {
      toast.error("fieldErrors");
    },
  });

  const handleSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    if (title === data.title) return disableEditing();

    execute({
      title,
      id,
      boardId,
    });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key == "Escape") {
      formRef.current?.requestSubmit();
    }
  };

  useEventListener("keydown", onKeyDown);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {editing ? (
        <form action={handleSubmit} ref={formRef} className="flex-1 px-[2px]">
          <input type="text" hidden id="id" name="id" defaultValue={data.id} />
          <input
            type="text"
            hidden
            id="boardId"
            name="boardId"
            defaultValue={data.boardId}
          />
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            placeholder="Enter List title ..."
            defaultValue={title}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
          />
          <button type="submit" hidden></button>
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </div>
      )}
      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  );
};

export default ListHeader;
