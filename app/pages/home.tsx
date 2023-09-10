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
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
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
          setName(user.name);
        }
        setLoading(false);
      }
    })();
  }, [usersClient]);

  return (
    <main>
      <div className='page-title flex justify-between p-6 font-bold text-4xl text-white text-center '>
        <h1>Paine-Fit</h1>
        <Header />
      </div>
      {loading ? (
          <div className='flex flex-col justify-center items-center'>
            <p className='m-4'>Loading your data...</p>
            <div role="status" className='m-4'>
              <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
      ) : (
        <div className='content-page flex flex-col m-10 gap-4'>
          <div className='flex flex-col gap-4 px-6 py-3 bg-white rounded-lg text-center font-bold'>
            <p>Welcome back {name}</p>
            <p>You know what time it is - it&apos;s time to grind!</p>
          </div>
          {products && products.includes('Abs') && (
            <Link href='./products/abs' className='px-6 py-3 bg-white rounded-lg text-center font-bold'>ABS</Link>
          )}
          {products && products.includes('Program') && (
            <Link href='./products/program' className='px-6 py-3 bg-white rounded-lg text-center font-bold'>PROGRAM</Link>
          )}
          {products && products.includes('Bundle') && (
            <Link href='./products/bundle' className='px-6 py-3 bg-white rounded-lg text-center font-bold'>BUNDLE</Link>
          )}
          {products && products.includes('Subscription') && (
            <Link href='./products/subscription' className='px-6 py-3 bg-white rounded-lg text-center font-bold'>SUBSCRIPTION</Link>
          )}
        </div>
      )}
    </main>
  )
}

export default Home;