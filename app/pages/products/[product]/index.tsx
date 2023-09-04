import Header from '@/components/Header';
import path from 'path';
import { promises as fs } from 'fs';
import Link from 'next/link';

import { GetStaticPaths, GetStaticProps } from 'next';

const Index = (props) => {
    return (
        <main>
            <div className='page-title flex justify-between p-6 font-bold text-4xl text-white text-center'>
                <h1>Paine-Fit</h1>
                <Header />
            </div>
            <div className='content-page'>
                {props.slugs.map((s, i) => (
                    <Link href={`./${props.product}/weeks/${s}`} key={i}>
                        <h3>{s}</h3>
                    </Link>
                ))}
            </div>
        </main>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const folder = path.join(process.cwd(), './content')
    const filenames = await fs.readdir(folder);
    const slugs = filenames.map(s => s.replace('.md', ''));

    return {
      paths: slugs.map(s => ({
        params: {
          product: s
        }})),
      fallback: true
    }
  }

export const getStaticProps: GetStaticProps = async (context) => {
    const folder = path.join(process.cwd(), `./content/${context.params.product}`)
    const filenames = await fs.readdir(folder);
    const slugs = filenames.map(s => s.replace('.md', ''));
    
    return {
      props: {
        product: context.params.product,
        slugs
      },
    }
}

export default Index;