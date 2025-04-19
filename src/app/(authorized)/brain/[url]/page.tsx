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
      <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Thought You Might Need These
        </h1>
        <h5 className="text-base text-gray-500">
          Just saving you a few clicks — here&apos;s everything in one spot
        </h5>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <DisplayBrains shareUrl={shareUrl} />
      </div>
    </>
  );
}

