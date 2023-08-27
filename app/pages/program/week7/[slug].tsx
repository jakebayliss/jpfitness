import { GetStaticProps, GetStaticPaths  } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw';
import Header from '@/components/Header';

const Index = (props: any) => {
  return (
    <main className='min-h-[calc(100vh-40px)]'>
      <div className='min-h-[calc(100vh-40px)]'>
        <div className='page-title flex justify-between p-6 font-bold text-4xl text-white text-center'>
          <h1>{props.workout.title}</h1>
          <Header />
        </div>
        <div className='content-page prose p-3 text-justify'>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{props.workout.content}</ReactMarkdown>
        </div>
      </div>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  if(!context.params) {
    return;
  }

  var workout = await getWorkout(context.params.slug as string);

  return {
    props: {
      workout
    }
  }
}

export const getWorkout = async (slug: string) => {
  const content = (await fs.readFile(`./content/program/week7/${slug}.md`)).toString();
  const data = matter(content) as FrontMatterResult<IWorkout>;

  return {
      ...data.attributes,
      content: data.body
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const folder = path.join(process.cwd(), './content/program/week7')
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