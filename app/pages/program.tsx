import { promises as fs } from 'fs';
import Link from 'next/link';
import path from 'path';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';
import Header from '@/components/Header';
import { useContext, useEffect, useState } from 'react';
import { User, UserContext } from '@/auth/UserContext';

const Index = ({workouts}: {
    workouts: {
      data: FrontMatterResult<IWorkout>;
      slug: string;
    }[]
  }) => {

  const { products } = useContext<User>(UserContext);
  const [showPage, setShowPage] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (products && products.includes('Program')) {
        setShowPage(true);
      }
    })();
  }, []);

  return (
    <main>
      <div className='page-title flex justify-between p-6 font-bold text-4xl text-white text-center'>
        <h1>Program</h1>
        <Header />
      </div>
      {!showPage && (
        <div className='content-page flex flex-col m-10 gap-4'>
          <div className='flex flex-col gap-4 px-6 py-3 bg-white rounded-lg text-center font-bold'>
            <p>You do not have access to view this page</p>
            <p>If you have purchased the program please sign in</p>
          </div>
        </div>
      )}
      <div className='content-page'>
        {workouts.sort(x => x.data.attributes.pageNumber).map((w, i) => (
          <Link href={`./program/${w.slug}`} key={i}>
            <h3>Week {w.data.attributes.week} - {w.data.attributes.title}</h3>
          </Link>
        ))}
      </div>
    </main>
  )
}
 
export async function getStaticProps() {
  const folder = path.join(process.cwd(), './content/program');
  const filenames = await fs.readdir(folder);
  const workouts = filenames.filter(async f => f.endsWith('.md')).map(async f => {
    var content = (await fs.readFile(`./content/program/${f}`)).toString();
    return {
      data: matter(content) as FrontMatterResult<IWorkout>,
      slug: f.replace('.md', '')
    };
  });

  return {
    props: {
      workouts: await Promise.all(workouts),
    },
  }
}

export default Index;