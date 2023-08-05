import { promises as fs } from 'fs';
import Link from 'next/link';
import path from 'path';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';

const Index = ({workouts}: {
    workouts: {
      data: FrontMatterResult<IWorkout>;
      slug: string;
    }[]
  }) => {
  return (
    <main className='p-5'>
      <h1 className='my-3 font-bold text-2xl'>Workouts</h1>
      <div>
        {workouts.map((w, i) => (
          <Link href={`/workouts/${w.slug}`} key={i}>
            <h3>Week {w.data.attributes.week} - {w.data.attributes.title}</h3>
          </Link>
        ))}
      </div>
    </main>
  )
}
 
export async function getStaticProps() {
  const folder = path.join(process.cwd(), '../workouts');
  const filenames = await fs.readdir(folder);
  const workouts = filenames.filter(async f => f.endsWith('.md')).map(async f => {
    var content = (await fs.readFile(`../workouts/${f}`)).toString();
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