import Image from 'next/image';

export const Index = () => (
  <Image
    className="h-full w-full"
    width={200}
    height={200}
    src={'/assets/joey-primary.png'}
    alt="XRPL logo"
  />
);
