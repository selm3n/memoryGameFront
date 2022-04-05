import spinner from "../assets/img/spinner.gif";

// spinner component
const Spinner =() => {
  return (
    <div>
      <img
        src={spinner}
        style={{ width: '300px', margin: 'auto', display: 'block' }}
        alt="Loading..."
      />
    </div>
  );
};
export default Spinner