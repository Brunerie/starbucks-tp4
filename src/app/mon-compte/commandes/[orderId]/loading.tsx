"use client";

import {Loader} from '@mantine/core';

export default function Loading() {
  return <div className='min-h-[500px] flex items-center justify-center'>
    <Loader className='stroke-brand' />
  </div>
}