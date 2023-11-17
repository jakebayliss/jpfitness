import Header from '@/components/Header';
import path from 'path';
import { promises as fs } from 'fs';
import Link from 'next/link';

import { GetStaticPaths, GetStaticProps } from 'next';
import { useContext, useEffect, useState } from 'react';
import { User, UserContext } from '@/auth/UserContext';
import { UsersClient } from '@/api-client';
import { useMsal } from '@azure/msal-react';
import { BASE_API_URL } from '@/config';
import { acquireAccessToken } from '@/auth/authConfig';
import matter, { FrontMatterResult } from 'front-matter';
import { IWorkout } from '@/interfaces/IWorkout';

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
        <main>
            <div className='page-title flex justify-between p-6 font-bold text-4xl text-white text-center'>
                <h1>Paine-Fit</h1>
                <Header />
            </div>
            <div className='flex flex-col m-10 gap-4'>
                {!access 
                    ? <h3 className='text-center'>Please sign in to view this content</h3>
                    : (hasBoughtProduct 
                        ? props.slugs.map((s: string, i: number) => (
                            s == 'warm-ups' 
                            ? <Link href={`./${props.product}/exercises/${s.toLowerCase()}`} key={i}>
                                <h3 className='first-letter:uppercase px-6 py-3 bg-white rounded-lg text-center font-bold'>{s}</h3>
                            </Link>
                            : <Link href={`./${props.product}/weeks/${s.toLowerCase()}`} key={i}>
                                <h3 className='first-letter:uppercase px-6 py-3 bg-white rounded-lg text-center font-bold'>{s?.replace('week', 'week ')}</h3>
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
        </main>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const folder = path.join(process.cwd(), './content')
    const filenames = await fs.readdir(folder);
    const slugs = filenames.map(s => s.replace('.md', ''));

    return {
      paths: slugs.map(s => ({
        params: {
          product: s
        }})),
      fallback: true
    }
  }

export const getStaticProps: GetStaticProps = async (context) => {
    const folder = path.join(process.cwd(), `./content/${context.params.product}`)
    const filenames = await fs.readdir(folder);
    const slugs = filenames.map(s => s.replace('.md', ''));
    
    return {
      props: {
        product: context.params.product,
        slugs
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

export default Index;