"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { AlignLeft } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import FormTextarea from "@/components/forms/form-textarea";
import { FormSubmit } from "@/components/forms/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/user-action";
import { updateCard } from "@/actions/update-card";
import { toast } from "sonner";

interface DescriptionProps {
  data: CardWithList;
}

export const Description = ({ data }: DescriptionProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const [editing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const textAreaRef = useRef<ElementRef<"textarea">>(null);

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      toast.success("Card is updated");
      disableEditing()
    },
    onError: (err) => {
      toast.error(`${err}`);
      disableEditing()
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
      textAreaRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    const boardId = params.boardId as string;

    // TODO Execute action
    execute({boardId: boardId, description: description, id: data.id})
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="size-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>

        {editing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              id="description"
              name="description"
              className="w-full mt-2 "
              placeHolder="Add detailed description"
              defaultValue={data.description || undefined}
              errors={fieldErrors}
              ref={textAreaRef}
            />
            <div className="flex item-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            role="button"
            onClick={enableEditing}
            className="min-h-[78px] bg-neutral-200 py-3 px-3.5 text-sm font-medium rounded-md"
          >
            {data.description || "Add a detailed description"}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full ">
      <Skeleton className="size-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] be-neutral-200" />
      </div>
    </div>
  );
};
