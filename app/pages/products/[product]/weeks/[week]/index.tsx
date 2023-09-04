import { GetStaticProps, GetStaticPaths  } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import Header from '@/components/Header';
import Link from 'next/link';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';

const Index = (props) => {
  console.log(props);
  return (
    <main className='min-h-[calc(100vh-40px)]'>
      <div className='min-h-[calc(100vh-40px)]'>
        <div className='page-title flex justify-between p-6 font-bold text-4xl text-white text-center'>
          <h1>{props.product}</h1>
          <Header />
        </div>
        <div className='content-page'>
          <h3>{props.week}</h3>
          {props?.workouts?.map((workout, i) => (
            <Link href={{
                  pathname: '/products/[product]/weeks/[week]/exercises/[exercise]',
                  query: { product: props.product, week: props.week, exercise: workout.exercise },
              }} key={i}>
              <h3>{workout.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  console.log(context);
    const folder = path.join(process.cwd(), `./content/${context.params.product}/${context.params.week}`)
    const filenames = await fs.readdir(folder);
    const slugs = filenames.map(s => s.replace('.md', ''));

    var workouts = await Promise.all(slugs.map(async (s) => {
      return await getWorkout(context.params.product as string, context.params.week as string, s);
    }));
    
    return {
      props: {
        product: context.params.product,
        week: context.params.week,
        workouts
      },
    }
}

export const getWorkout = async (product: string, week: string, exercise: string) => {
  const content = (await fs.readFile(`./content/${product}/${week}/${exercise}.md`)).toString();
  const data = matter(content) as FrontMatterResult<IWorkout>;

  return {
      ...data.attributes,
      exercise,
      content: data.body
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const folder = path.join(process.cwd(), './content')
  const filenames = await fs.readdir(folder);
  const slugs = filenames.map(s => s.replace('.md', ''));

  return {
    paths: slugs.map(s => ({
      params: {
        product: s,
        week : 'week1'
      }})),
    fallback: true
  }
}

export default Index;