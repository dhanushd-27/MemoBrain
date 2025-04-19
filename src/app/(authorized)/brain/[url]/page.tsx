import React from 'react';
import DisplayBrains from '@/components/DisplayBrains';

type Props = {
  params: {
    url: string;
  };
};

export default async function DisplayBrain({ params }: Props) {
  const { url: shareUrl } = await params;

  return (
    <>
      <DisplayBrains shareUrl={shareUrl} />
    </>
  );
}
