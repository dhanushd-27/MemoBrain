import React from 'react'
import BrainCard from '@/components/BrainCard'
import { CreateBrain } from '@/components/buttons/createBrain';
import { Share } from '@/components/buttons/shareButton';

const tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8'];

export default function page() {
  return (
    <>
      <BrainCard tags={ tags } title='Something' type='Video' url='https://www.youtube.com/watch?v=fFja4Jp3H5w' />
      <CreateBrain />
      <Share />
    </>
  )
}
