import { GetStaticProps, GetStaticPaths  } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw';
import Header from '@/components/Header';
import { useContext, useEffect, useState } from 'react';
import { UsersClient } from '@/api-client';
import { BASE_API_URL } from '@/config';
import { acquireAccessToken } from '@/auth/authConfig';
import { useMsal } from '@azure/msal-react';
import { User, UserContext } from '@/auth/UserContext';

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
        <div className='content-page prose p-3 text-justify'>
            <h3 className='first-letter:uppercase'>{props.workout.title}</h3>
            {!access 
                ? <h3 className='text-center'>Please sign in to view this content</h3>
                : (hasBoughtProduct 
                    ? <ReactMarkdown rehypePlugins={[rehypeRaw]}>{props.workout.content}</ReactMarkdown>
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
  var workout = await getWorkout(context.params.product as string, context.params.exercise as string);

  return {
    props: {
        product: context.params.product,
        exercise: context.params.exercise,
        workout: workout
    },
    revalidate: 60
  }
}

export const getWorkout = async (product: string, exercise: string) => {
  const content = (await fs.readFile(`./content/${product}/${exercise}.md`)).toString();
  const data = matter(content) as FrontMatterResult<IWorkout>;

  return {
      ...data.attributes,
      content: data.body
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const folder = path.join(process.cwd(), './content/abs')
  const filenames = await fs.readdir(folder);
  const slugs = filenames.map(s => s.replace('.md', ''));

  return {
    paths: slugs.map(s => ({
      params: {
        product: 'abs',
        exercise: s
      }})),
    fallback: true,
  };
}

export default Index;