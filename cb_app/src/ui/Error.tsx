import { useNavigate, useRouteError } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();
  const error = useRouteError() as unknown;

  const isErrorWithMessage = (error: unknown): error is { message?: string; data?: string } => {
    return typeof error === 'object' && error !== null && ('message' in error || 'data' in error);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Something went wrong </h1>
      {isErrorWithMessage(error) ? (
        <>
          <p>{error.data || error.message}</p>
          {Object.entries(error).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
            </p>
          ))}
        </>
      ) : (
        <p>Unknown error occurred</p>
      )}
      <button onClick={() => navigate(-1)}>&larr; Go back</button>
    </div>
  );
};
export default Error;
