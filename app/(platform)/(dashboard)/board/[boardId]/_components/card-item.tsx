import { Card } from "@prisma/client";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-model";

interface CardItemProps {
  data: Card;
  index: number;
}
const CardItem = ({ data, index }: CardItemProps) => {
  const CardModal = useCardModal();
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => CardModal.onOpen(data.id)}
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm cursor:pointer"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
