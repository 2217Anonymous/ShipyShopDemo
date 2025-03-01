import update from "immutability-helper";
import { useCallback } from "react";
import Card from "./Card";
import { Col, Row } from "reactstrap";

const Container = ({ setImageUrl, imageUrl, handleRemoveImage, handleReplaceImageModal }) => {
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      setImageUrl((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
      );
    },
    [setImageUrl]
  );

  const renderCard = useCallback(
    (card, i) => (
      <Col sm="3" key={i}>
        <Card
          index={i}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
          image={card}
          handleRemoveImage={handleRemoveImage}
          handleReplaceImageModal={handleReplaceImageModal}
        />
      </Col>
    ),
    [moveCard, handleRemoveImage, handleReplaceImageModal]
  );

  return (
    <Row className="flex-wrap">
      {imageUrl.map((card, i) => renderCard(card, i))}
    </Row>
  );
};

export default Container;
