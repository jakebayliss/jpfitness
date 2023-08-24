import { GetStaticProps, GetStaticPaths  } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw';
import Header from '@/components/Header';
import Link from 'next/link';

const Index = (props: any) => {
  return (
    <main>
      <div className='page-title flex justify-between p-6 font-bold text-4xl text-white text-center'>
        <h1>Bundle</h1>
        <Header />
      </div>
      <div className='content-page'>
        {props.folders.map((folder, i) => (
          <Link href={`./bundle/${folder}`} key={i}>
            <h3>{folder}</h3>
          </Link>
        ))}
      </div>
    </main>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const folder = path.join(process.cwd(), './content/bundle/Week7')
  const filenames = await fs.readdir(folder);
  const slugs = filenames.map(s => s.replace('.md', ''));

  return {
    paths: slugs.map(s => ({
      params: {
        slug: s
      }})),
    fallback: false
  }
}

export default Index;