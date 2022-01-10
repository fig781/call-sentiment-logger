import Head from 'next/head';
import NavBar from '../components/NavBar';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Cloud Native Hackathon</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <NavBar />
    </div>
  );
}