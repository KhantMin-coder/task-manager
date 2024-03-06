"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useAction } from "@/hooks/user-action";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useCardModal } from "@/hooks/use-card-model";

interface ActionsProps {
  data: CardWithList;
}

const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const cardModel = useCardModal();
  const {
    execute: executeCopyCard,
    fieldErrors: copyFieldsError,
    loading: isLoadingCopy,
  } = useAction(copyCard, {
    onSuccess: (data) => {
      toast.success(`Card ${data.title} copied successfully `);
      cardModel.onClose();
    },
    onError: (err) => {
      toast.error(`Error copying card `);
    },
  });

  const {
    execute: executeDeleteCard,
    fieldErrors: deleteFieldsError,
    loading: isLoadingDelete,
  } = useAction(deleteCard, {
    onSuccess: (data) => {
      toast.success(`Card ${data.title} delete successfully `);
      cardModel.onClose();
    },
    onError: (err) => {
      toast.error(`Error copying card `);
    },
  });

  const onCopy = () => {
    const boardId = params.boardId as string;
    executeCopyCard({
      id: data.id,
      boardId,
    });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;
    executeDeleteCard({
      id: data.id,
      boardId,
    });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        disabled={isLoadingCopy || isLoadingDelete}
        variant="gray"
        className="w-full justfy-start"
        size="inline"
        onClick={onCopy}
      >
        <Copy className="size-4 mr-2" />
        Copy
      </Button>
      <Button
        disabled={isLoadingDelete || isLoadingCopy}
        variant="gray"
        className="w-full justfy-start"
        size="inline"
        onClick={onDelete}
      >
        <Trash className="size-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

export default Actions;

Actions.Skleton = function ActionsSkeleto() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-4 bg-neutral-200" />
    </div>
  );
};
