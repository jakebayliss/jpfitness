import path from 'path';
import { promises as fs } from 'fs';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';
import Header from '@/components/Header';
import Link from 'next/link';
import { useContext } from 'react';
import { User, UserContext } from '@/auth/UserContext';

const Index = (props) => {
  const { user, products } = useContext<User>(UserContext);
  
  let access = user !== null;
  let hasBoughtProduct = products.some(product => product === 'Abs');
  return (
    <main>
      <div className='page-title flex justify-between p-6 font-bold text-4xl text-white text-center'>
        <h1>Abs</h1>
        <Header />
      </div>
      <div className='content-page'>
        {!access ? (
          <h3 className='text-center'>Please sign in to view this content</h3>
        ) : (
          hasBoughtProduct ? (
            props.workouts.sort((a,b)=>a.order-b.order).map((workout, i) => (
              <Link href={`./abs/${workout.link}`} key={i}>
                <h3>{workout.title}</h3>
              </Link>
            ))
          ) : (
            <div className='flex flex-col items-center gap-2 m-6 px-6 py-4 bg-white rounded-lg shadow-md'>
              <p>Looks like you haven't bought this product yet!</p>
              <p>Head to our store front below to make the purchase.</p>
              <a href='https://joshua-paine-fitness-program.dpdcart.com/' target='_blank'
                className='px-6 py-3 secondary-colour rounded-lg font-bold'>STORE</a>
            </div>
          )
        )}
      </div>
    </main>
  )
}

export async function getStaticProps() {
  const folder = path.join(process.cwd(), './content/abs');
  const filenames = await fs.readdir(folder);
  const slugs = filenames.map(async s => {
    const content = (await fs.readFile(`./content/abs/${s}`)).toString();
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