// import { createBrain } from '@/actions/post/create-brain'
import { shareBrain } from '@/actions/get/share-brain'
import React from 'react'

export default function Dashboard() {

  // createBrain({
  //   type: "solid",
  //   tags: ["idk"],
  //   title: "something",
  //   url: "abcde",
  //   share: true
  // })
  shareBrain();
  return (
       <div>
        Dashboard,
        <br />
      </div>
  )
}
