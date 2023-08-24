import { promises as fs } from 'fs';
import Link from 'next/link';
import path from 'path';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';
import Header from '@/components/Header';

const Index = (props) => {
  console.log(props.folders);
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
 
export async function getStaticProps() {
  const folder = path.join(process.cwd(), './content/bundle');
  const filenames = await fs.readdir(folder);

  console.log(filenames);
  return {
    props: {
      folders: filenames,
    },
  }
}

export default Index;