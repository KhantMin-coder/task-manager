"use client";

import { ListWithCards } from "@/types";
import ListForm from "./list-form";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import ListItem from "./list-item";
import { useAction } from "@/hooks/user-action";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { toast } from "sonner";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

const reorder = <Type,>(list: Type[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderData, setOrderData] = useState(data);

  const {
    execute: executeUpdateListOrder,
    fieldErrors: listUpdateFieldErrors,
  } = useAction(updateListOrder, {
    onSuccess: (data) => {
      toast.success("List reordered");
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const {
    execute: executeUpdateCardOrder,
    fieldErrors: cardUpdateFieldErrors,
  } = useAction(updateCardOrder, {
    onSuccess: (data) => {
      toast.success("card reordered");
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  useEffect(() => {
    setOrderData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;
    if (!destination) return;

    // If Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // If User move list
    if (type === "list") {
      const items = reorder(orderData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );
      setOrderData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // If User move card
    if (type === "card") {
      const newOrderData = [...orderData];

      // Source and destinationList
      const sourceList = newOrderData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // check if cards exists in the sorucelist, if no exist create new Array
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // check if cards exists in the destlist, if no exist create new Array
      if (!destList.cards) {
        destList.cards = [];
      }

      // User move card within same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        // Change the eorder of each card
        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards;

        setOrderData(newOrderData);
        // TODO: Trigger Server Action
        executeUpdateCardOrder({ boardId: boardId, items: reorderedCards });
      } else {
        // User move to new list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign new listId to moved card
        movedCard.listId = destination.droppableId;

        // Add card to destionationList
        destList.cards.splice(destination.index, 0, movedCard);

        // Update order for each card in the source list
        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // Update order for each card in the dest list
        destList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderData(newOrderData);
        // TODO: Trigger Server Action
        executeUpdateCardOrder({ boardId: boardId, items: destList.cards });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderData.map((list, index) => (
              <ListItem key={list.id} index={index} data={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1"></div>
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
