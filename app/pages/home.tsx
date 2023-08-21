import Header from '@/components/Header';
import { useEffect, useState } from 'react';

import { useMsal } from '@azure/msal-react';

import { UsersClient } from '@/api-client';

import { BASE_API_URL } from '../config';
import { acquireAccessToken } from '@/auth/authConfig';

const Home = () => {

  const { instance, accounts } = useMsal();
  const b2cUser = accounts[0];

  const [usersClient, setUsersClient] = useState<UsersClient>();

  const [products, setProducts] = useState([]);

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
        if(user){
          setProducts(user.products);
        }
      }
    })();
  }, [usersClient])

  return (
    <main>
      <div className='page-title flex justify-between p-6 font-bold text-4xl text-white text-center '>
        <h1>Paine-Fit</h1>
        <Header links={null}/>
      </div>
      <div className='content-page flex flex-col m-10 gap-4'>
        <div className='flex flex-col gap-4 px-6 py-3 bg-white rounded-lg text-center font-bold'>
          <p>Welcome back.</p>
          <p>You know what time it is - it's time to grind!</p>
        </div>
        {products && products.includes('Abs') && (
          <a href='./abs' className='px-6 py-3 bg-white rounded-lg text-center font-bold'>ABS</a>
        )}
        {products && products.includes('Program') && (
          <a href='./program' className='px-6 py-3 bg-white rounded-lg text-center font-bold'>PROGRAM</a>
        )}
        {products && products.includes('Bundle') && (
          <a href='./bundle' className='px-6 py-3 bg-white rounded-lg text-center font-bold'>BUNDLE</a>
        )}
        {products && products.includes('Subscription') && (
          <a href='./subscription' className='px-6 py-3 bg-white rounded-lg text-center font-bold'>SUBSCRIPTION</a>
        )}
      </div>
    </main>
  )
}

export default Home;