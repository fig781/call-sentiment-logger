import React from 'react'
import Link from 'next/link'

const NavBar = () => {
  return (
    <navbar className=''>
      <Link href='/'>
        <a>Home</a>
      </Link>
      <Link href='/dashboard'>
        <a>Dashboard</a>
      </Link>
      <Link href='/about'>
        <a>About</a>
      </Link>
    </navbar>
  )
}

export default NavBar
