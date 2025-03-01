import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes.js";
import { Button, CardBody } from "reactstrap";

const Card = ({ id, image, index, moveCard, handleRemoveImage, handleReplaceImageModal }) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} data-handler-id={handlerId}  style={{
      width: '100px',
    }} className="position-relative mx-2 px-2 ">
      <div className="border rounded shadow bg-white p-2 position-relative">
        <img
          className="rounded img-fluid"
          src={image}
          alt="product"
          style={{ objectFit: "cover" }}
        />

        {/* Close Button - Circular */}
        <Button
          color="danger"
          size="sm"
          className="rounded-circle position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center shadow"
          style={{ width: "15px", height: "15px", opacity: "0.9", padding: 0 }}
          onClick={() => handleRemoveImage(image)}
        >
          ✕
        </Button>

        <Button
          color="primary"
          size="sm"
          className="rounded-circle position-absolute bottom-0 start-0 m-1 d-flex align-items-center justify-content-center shadow"
          style={{ width: "15px", height: "15px", opacity: "0.9", padding: 0 }}
          onClick={() => handleReplaceImageModal(image)}
        >
          ⟳
        </Button>
      </div>
    </div>
  );
};

export default Card;
