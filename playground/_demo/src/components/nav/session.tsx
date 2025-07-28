'use client';
import type { SessionTypes } from '@walletconnect/types';

import { Button } from '../ui/button';
import useUnifiedProvider from '~/hooks/useUnifiedProvider';

export interface Props {
  sessions?: SessionTypes.Struct[];
  activeSession?: SessionTypes.Struct;
  setActiveSession: (s: SessionTypes.Struct | undefined) => void;
}

const Selector = (props: Props & { id: string; session: SessionTypes.Struct }) => {
  const { session } = useUnifiedProvider();

  const isActive = session?.topic === props.id;

  const handleClick = () => (isActive ? undefined : props.setActiveSession(props.session));

  return (
    <Button
      theme={isActive ? 'Accent' : 'Default'}
      variant={isActive ? 'default' : 'outline'}
      className={`
        justify-center items-center
        max-w-[100px]
        cursor-pointer h-full ${isActive ? 'text-white' : 'text-color11'}
      `}
      onClick={handleClick}>
      <div className="w-full overflow-hidden truncate">{props.id}</div>
    </Button>
  );
};

export const Index = (props: Props) => {
  const { sessions } = props;

  return (
    <>
      {sessions && sessions.length > 0 && (
        <div className="w-full h-fit text-color12 py-2 overflow-x-auto overflow-y-hidden bg-color4/60 shrink-0 flex items-center gap-3 px-4 border-t border-b border-color3">
          <div className="w-fit h-fit flex gap-3 grow ">
            {sessions && sessions.length > 0 && (
              <>
                <div className="flex justify-center items-center">Sessions:</div>
                {sessions.map((s) => (
                  <Selector session={s} key={s.topic} id={s.topic} {...props} />
                ))}
              </>
            )}
          </div>
          {sessions && (
            <Button
              disabled
              variant="outline"
              size={'sm'}
              className={`
          flex justify-center items-center
          cursor-pointer h-fit w-fit p-3 px-3 
      `}>
              <div className="aspect-square h-full w-full flex justify-center items-center">+</div>
            </Button>
          )}
        </div>
      )}
    </>
  );
};
