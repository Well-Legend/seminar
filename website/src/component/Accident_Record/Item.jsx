const Item = ({ ID, event }) => {
  return (
    <div className="item">
      <p>Car ID is: {ID}</p>
      <p>The accident is: {event}</p>
    </div>
  );
};

export default Item;
