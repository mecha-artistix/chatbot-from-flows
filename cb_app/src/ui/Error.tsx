import { useNavigate, useRouteError } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();
  const error = useRouteError();
  console.log(error);
  return (
    <div style={{ padding: 20 }}>
      <h1>Something went wrong </h1>
      <p>{error.data || error.message}</p>
      {Object.entries(error).map(([key, value]) => (
        <p key={key}>
          <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
        </p>
      ))}
      <button onClick={() => navigate(-1)}>&larr; Go back</button>
    </div>
  );
};
export default Error;
