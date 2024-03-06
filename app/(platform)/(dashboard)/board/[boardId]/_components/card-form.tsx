"use client";
import { forwardRef, useRef, ElementRef, KeyboardEventHandler } from "react";
import { Plus, X } from "lucide-react";
import { useAction } from "@/hooks/user-action";
import { useParams } from "next/navigation";

import { FormSubmit } from "@/components/forms/form-submit";
import FormTextarea from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";
import { createCard } from "@/actions/create-card";
import { useOnClickOutside, useEventListener } from "usehooks-ts";
import { toast } from "sonner";

interface CardFormProps {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
}

const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, enableEditing, disableEditing, isEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);
    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Successfuly create card ${data.title}`);
        formRef.current?.reset();
      },
      onError: (err) => {
        toast.error(`Failed to create new card`);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    const onTextAreaKeydown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = params.boardId as string;

      execute({ title, boardId, listId });
    };

    if (isEditing)
      return (
        <form ref={formRef} action={onSubmit} className="m-1 py-0.5 space-y-4 px-1">
          <FormTextarea
            id="title"
            name="title"
            onKeyDown={onTextAreaKeydown}
            ref={ref}
            placeHolder="Enter a title for this card"
            errors={fieldErrors}
          />
          <input hidden id="listId" name="listId" defaultValue={listId} />

          <div className="flex items-center gap-x-1">
            <FormSubmit>Add Card</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="size-5" />
            </Button>
          </div>
        </form>
      );

    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          size="sm"
          variant="ghost"
          className="h-auto px-2 py-1.5 w-full justify-start text-mute foreground text-sm"
        >
          <Plus className="size-4 mr-2" /> Add a card
        </Button>
      </div>
    );
  }
);

export default CardForm;

CardForm.displayName = "CardForm";
