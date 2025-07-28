'use client';

import { useState, useEffect } from 'react';
import packageJson from '~/../package.json';

export const useVersion = () => {
  const [version, setVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVersion = async () => {
      setIsLoading(true);
      try {
        const depVersion = packageJson.version;

        if (depVersion && !depVersion.includes('workspace')) {
          setVersion(`v${depVersion.replace(/^\^|~/, '')}`);
          setIsLoading(false);
          return;
        }

        // If no version found, set error
        setError(`Version for package "${packageJson.name}" not found`);
      } catch (err) {
        setError(`Error fetching version for "${packageJson.name}": ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersion();
  }, [packageJson]);

  return { version, error, isLoading };
};
