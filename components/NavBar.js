import React from 'react';
import Link from 'next/link';

const navBar = () => {
  return (
    <div>
      <Link href='/'>
        <a>Home</a>
      </Link>
      <Link href='/dashboard'>
        <a>Dashboard</a>
      </Link>
    </div>
  );
};

export default navBar;
