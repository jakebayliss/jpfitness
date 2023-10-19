import { GetStaticProps, GetStaticPaths  } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import Header from '@/components/Header';
import Link from 'next/link';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';
import { useContext, useEffect, useState } from 'react';
import { User, UserContext } from '@/auth/UserContext';
import { UsersClient } from '@/api-client';
import { useMsal } from '@azure/msal-react';
import { BASE_API_URL } from '@/config';
import { acquireAccessToken } from '@/auth/authConfig';

const Index = (props) => {
  const { user, setUser, products, setProducts } = useContext<User>(UserContext);
  const [usersClient, setUsersClient] = useState<UsersClient>();
  const { instance, accounts } = useMsal();
  const b2cUser = accounts[0];
  
  let access = user !== null;
  let hasBoughtProduct = products.some(product => product.toLowerCase() === props.product.toLowerCase());

  useEffect(() => {
    (async () => {
      setUsersClient(new UsersClient(BASE_API_URL));
    })();
  }, []);
  
  useEffect(() => {
    (async () => {
      if (usersClient && b2cUser && !user) {
        var token = await acquireAccessToken(instance);
        const user = await usersClient.getJPUserFromEmail(b2cUser.username, token.idToken);
        if(user) {
          setUser(b2cUser);
          setProducts(user.products);
        }
      }
    })();
  }, [usersClient]);

  return (
    <main className='min-h-[calc(100vh-40px)]'>
      <div className='min-h-[calc(100vh-40px)]'>
        <div className='page-title flex justify-between p-6 font-bold text-4xl text-white text-center'>
          <h1 className='first-letter:uppercase'>{props.product}</h1>
          <Header />
        </div>
        <div className='content-page'>
          <h3 className='first-letter:uppercase'>{props.week}</h3>
          {!access 
            ? <h3 className='text-center'>Please sign in to view this content</h3>
            : (hasBoughtProduct 
                ? props?.workouts?.map((workout, i) => (
                  <Link href={{
                        pathname: '/products/[product]/weeks/[week]/exercises/[exercise]',
                        query: { product: props.product, week: props.week, exercise: workout.exercise },
                    }} key={i}>
                    <h3>{workout.title}</h3>
                  </Link>
                ))
                : <div className='flex flex-col items-center gap-2 m-6 px-6 py-4 bg-white rounded-lg shadow-md'>
                    <p>Looks like you haven&apos;t bought this product yet!</p>
                    <p>Head to our store front below to make the purchase.</p>
                    <a href='https://joshua-paine-fitness-program.dpdcart.com/' target='_blank'
                        className='px-6 py-3 secondary-colour rounded-lg font-bold'>STORE</a>
                </div>
            )
          }
        </div>
      </div>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
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
      revalidate: 60
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

export const getStaticPaths = async () => {
  const baseFolder = path.join(process.cwd(), '/content');
  debugger;
  const paths = await generatePaths(baseFolder);

  return {
    paths,
    fallback: true,
  };
};

async function generatePaths(currentFolder: string) {
  const entries = await fs.readdir(currentFolder);
  const paths = [];
  // products
  for (const entry of entries) {
    const entryPath = path.join(currentFolder, entry);
    if(entry != 'abs') {
      const weekEntries = await fs.readdir(entryPath);
      // weeks
      for(const weekEntry of weekEntries) {
        var weekEntryPath = path.join(entryPath, weekEntry);
        const stats = await fs.lstat(weekEntryPath);
        if(stats.isDirectory()) {
          const exercises = await fs.readdir(weekEntryPath);
          // exercises
          for(const exercise of exercises) {
            const params = {
              product: entry,
              week: weekEntry,
              exercise: exercise.replace('.md', ''),
            }
            paths.push({params});
          }
        }
        else {
          const params = {
            product: entry,
            week: '',
            exercise: weekEntry.replace('.md', ''),
          }
          paths.push({params});
        }
      }
    }
  }

  return paths;
}

export default Index;