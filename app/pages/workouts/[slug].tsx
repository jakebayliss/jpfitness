import { GetStaticProps, GetStaticPaths  } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';
import Footer from '@/components/Footer';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw';

const Index = (props: any) => {
  return (
    <main>
      <div className='p-5'>
        <h1 className='my-3 font-bold text-2xl'>Week {props.workout.week} - {props.workout.title}</h1>
        <div className='prose'>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{props.workout.content}</ReactMarkdown>
        </div>
      </div>
      <Footer currentPageNumber={1} nextPage='week1-arms' previousPage='week1-welcome' />
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
  const content = (await fs.readFile(`./content/${slug}.md`)).toString();
  const data = matter(content) as FrontMatterResult<IWorkout>;

  return {
      ...data.attributes,
      content: data.body
  }
}


export const getStaticPaths: GetStaticPaths = async () => {
  const folder = path.join(process.cwd(), './content')
  const filenames = await fs.readdir(folder);
  console.log(filenames);
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