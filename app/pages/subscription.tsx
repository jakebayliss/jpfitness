import { promises as fs } from 'fs';
import Link from 'next/link';
import path from 'path';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';
import Header from '@/components/Header';

const Index = ({workouts}: {
    workouts: {
      data: FrontMatterResult<IWorkout>;
      slug: string;
    }[]
  }) => {
  return (
    <main>
      <Header />
      <h1 className='page-title p-6 font-bold text-4xl text-white text-center'>Subscription</h1>
      <div>
        {workouts.sort(x => x.data.attributes.pageNumber).map((w, i) => (
          <Link href={`./subscription/${w.slug}`} key={i}>
            <h3>Week {w.data.attributes.week} - {w.data.attributes.title}</h3>
          </Link>
        ))}
      </div>
    </main>
  )
}
 
export async function getStaticProps() {
  const folder = path.join(process.cwd(), './content/subscription');
  const filenames = await fs.readdir(folder);
  const workouts = filenames.filter(async f => f.endsWith('.md')).map(async f => {
    var content = (await fs.readFile(`./content/subscription/${f}`)).toString();
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