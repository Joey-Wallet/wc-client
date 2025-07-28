'use client';

import { useState, useEffect } from 'react';
import packageJson from '~/../package.json'; // Adjust path based on your project structure

export const usePackageVersion = (packageName: string) => {
  const [version, setVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVersion = async () => {
      setIsLoading(true);
      try {
        const depVersion =
          // @ts-ignore -- ignore
          packageJson.dependencies?.[packageName] || packageJson.devDependencies?.[packageName];

        if (depVersion && !depVersion.includes('workspace')) {
          setVersion(depVersion.replace(/^\^|~/, '')); // Remove ^ or ~ for clean version
          setIsLoading(false);
          return;
        }

        const scope = packageName.split('/')[0]; // e.g., @joey-wallet
        const name = packageName.split('/')[1]; // e.g., wc-client
        const pkgPath = scope
          ? `../../../packages/${scope}/${name}/package.json`
          : `../../../packages/${packageName}/package.json`;
        let pkg = await import(pkgPath);
        if (pkg.version) {
          setVersion(pkg.version);
          setIsLoading(false);
          return;
        }

        pkg = await import(`${packageName}/package.json`);
        if (pkg.version) {
          setVersion(pkg.version);
          setIsLoading(false);
          return;
        }

        // If no version found, set error
        setError(`Version for package "${packageName}" not found`);
      } catch (err) {
        setError(`Error fetching version for "${packageName}": ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersion();
  }, [packageName]);

  return { version, error, isLoading };
};
