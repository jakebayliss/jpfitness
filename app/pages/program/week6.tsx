import path from 'path';
import { promises as fs } from 'fs';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';
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
        {props.workouts.sort((a,b)=>a.order-b.order).map((workout, i) => (
          <Link href={`./week6/${workout.link}`} key={i}>
            <h3>{workout.title}</h3>
          </Link>
        ))}
      </div>
    </main>
  )
}

export async function getStaticProps() {
  const folder = path.join(process.cwd(), './content/program/week6');
  const filenames = await fs.readdir(folder);
  const slugs = filenames.map(async s => {
    const content = (await fs.readFile(`./content/program/week6/${s}`)).toString();
    const data = matter(content) as FrontMatterResult<IWorkout>;
    return {title: data.attributes.title, link:s.replace('.md', ''), order: data.attributes.pageNumber};
  });

  return {
    props: {
      workouts: await Promise.all(slugs),
    },
  }
}

export default Index;