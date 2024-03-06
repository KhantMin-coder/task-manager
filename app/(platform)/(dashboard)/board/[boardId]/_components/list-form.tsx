"use client";

import { useState, useRef, ElementRef } from "react";
import { Plus, X } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useParams, useRouter } from "next/navigation";

import ListWrapper from "./list-wrapper";

import { useAction } from "@/hooks/user-action";
import { createList } from "@/actions/create-list";
import FormInput from "@/components/forms/form-input";
import { FormSubmit } from "@/components/forms/form-submit";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ListForm = () => {
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} created successfully`);
      disableEditing();
    },
    onError: (err) => {
      toast.error(`Err ${err}`);
    },
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escase") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;

    execute({
      title,
      boardId,
    });
  };

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
          action={onSubmit}
        >
          <FormInput
            ref={inputRef}
            errors={fieldErrors}
            id="title"
            placeholder="Enter List title..."
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
          />
          {/* Can fetch value whenusing onSubmit function.  */}
          <input hidden defaultValue={params.boardId} name="boardId" />
          <div className="flex items-center gap-x 1">
            <FormSubmit>Add List</FormSubmit>
            <Button size="sm" variant="ghost" onClick={disableEditing}>
              <X className="h-5 w-5 " />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={() => enableEditing()}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
};

export default ListForm;
