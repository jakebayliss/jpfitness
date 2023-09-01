import Header from '@/components/Header';
import { useContext, useEffect, useState } from 'react';

import { useMsal } from '@azure/msal-react';

import { UsersClient } from '@/api-client';

import { BASE_API_URL } from '../config';
import { acquireAccessToken } from '@/auth/authConfig';
import { User, UserContext } from '@/auth/UserContext';
import Link from 'next/link';

const Home = () => {
  
  const [usersClient, setUsersClient] = useState<UsersClient>();
  const { instance, accounts } = useMsal();
  const b2cUser = accounts[0];
  const { user, setUser, products, setProducts } = useContext<User>(UserContext);

  useEffect(() => {
    (async () => {
      setUsersClient(new UsersClient(BASE_API_URL));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (usersClient && b2cUser) {
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
      <div className='page-title flex justify-between p-6 font-bold text-4xl text-white text-center '>
        <h1>Paine-Fit</h1>
        <Header />
      </div>
      <div className='content-page flex flex-col m-10 gap-4'>
        <div className='flex flex-col gap-4 px-6 py-3 bg-white rounded-lg text-center font-bold'>
          <p>Welcome back {b2cUser.idTokenClaims.given_name as string}</p>
          <p>You know what time it is - it&apos;s time to grind!</p>
        </div>
        {products && products.includes('Abs') && (
          <Link href='./abs' className='px-6 py-3 bg-white rounded-lg text-center font-bold'>ABS</Link>
        )}
        {products && products.includes('Program') && (
          <Link href='./program' className='px-6 py-3 bg-white rounded-lg text-center font-bold'>PROGRAM</Link>
        )}
        {products && products.includes('Bundle') && (
          <Link href='./bundle' className='px-6 py-3 bg-white rounded-lg text-center font-bold'>BUNDLE</Link>
        )}
        {products && products.includes('Subscription') && (
          <Link href='./subscription' className='px-6 py-3 bg-white rounded-lg text-center font-bold'>SUBSCRIPTION</Link>
        )}
      </div>
    </main>
  )
}

export default Home;