import { useCallback, useState } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(
    (onPermissionDenied?: () => void, onNoGeolocation?: () => void) => {
      setError(null);
      if (!navigator.geolocation) {
        if (onNoGeolocation) {
          onNoGeolocation();
        }
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          if (onPermissionDenied) {
            onPermissionDenied();
          }
        }
      );
    },
    []
  );

  return { location, error, setError, requestLocation };
};
