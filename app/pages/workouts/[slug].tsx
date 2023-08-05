import { GetStaticProps, GetStaticPaths  } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import Markdown from 'markdown-to-jsx';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';
import Footer from '@/components/Footer';

const Index = (props: any) => {
  return (
    <main>
      <div className='p-5'>
        <h1 className='my-3 font-bold text-2xl'>Week {props.data.attributes.week} - {props.data.attributes.title}</h1>
        <div>
          <Markdown>{props.data.body}</Markdown>
        </div>
      </div>
      <Footer currentPageNumber={1} nextPage='week1-arms' previousPage='week1-welcome' />
    </main>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  if(context.params) {
    var content = (await fs.readFile(`../workouts/${context.params.slug}.md`)).toString();
    var data = matter(content) as FrontMatterResult<IWorkout>;

    return {
      props: {
        data
      }
    }
  }

  return {
    props: {}
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const folder = path.join(process.cwd(), '../workouts')
  const filenames = await fs.readdir(folder);

  return {
    paths: filenames.map((s) => ({ params: { slug: s }})),
    fallback: true
  }
}

export default Index;