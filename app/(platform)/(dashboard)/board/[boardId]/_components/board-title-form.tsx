"use client";
import { ElementRef, useRef, useState } from "react";
import FormInput from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client";
import { updateBoard } from "@/actions/update-board";
import { useAction } from "@/hooks/user-action";
import { toast } from "sonner";

interface BoardTitleFormProps {
  data: Board;
}
const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board ${data.title} is updated`);
      setTitle(data.title)
      disableEditing()
    },
    onError: () => {
      toast.error(`Something went wrong,Update Error`);
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef?.current?.focus();
      inputRef?.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = (formData: FormData) => {
    let title = formData.get("title") as string;
    execute({ title: title, id: data.id });
    // formRef.current?.reset();
  };

  const onBlur = () => {
    formRef.current?.reset();
    // formRef.current?.requestSubmit();
  };

  if (isEditing)
    return (
      <form
        action={async (formData) => {
          await onSubmit(formData);
        }}
        ref={formRef}
        className="flex items-center gap-x-2"
      >
        <FormInput
          ref={inputRef}
          id="title"
          onBlur={() => {}}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );

  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  );
};

export default BoardTitleForm;
