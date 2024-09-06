import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const usePreserveLocation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedPath = sessionStorage.getItem('currentPath');
    if (storedPath && window.location.pathname !== storedPath) {
      navigate(storedPath, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    sessionStorage.setItem('currentPath', window.location.pathname);
  }, [window.location.pathname]);
};

export default usePreserveLocation;
