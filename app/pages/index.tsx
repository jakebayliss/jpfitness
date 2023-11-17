import React, { useContext } from 'react';
import { User, UserContext } from '../auth/UserContext';
import { loginRequest } from '../auth/authConfig';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import Home from "./home";

const Index = () => {
  const { instance } = useMsal();
  const { user, setUser } = useContext<User>(UserContext);

  return (
    <>
      <UnauthenticatedTemplate>
        <main className='min-h-screen flex flex-col justify-between gap-0'>
          <h1 className='page-title p-6 font-bold text-4xl text-white text-center'>Paine-Fit</h1>
          <div className='flex flex-col items-center p-6 gap-10'>
            <h3 className='text-center font-bold text-4xl'>Welcome to the start of your fitness journey!</h3>
            <button className='px-6 py-2 my-10 bg-gray-500 text-white rounded-lg font-bold'
              onClick={() => instance.loginRedirect(loginRequest)}>
                SIGN IN
            </button>
            <div className='flex flex-col items-center gap-1'>
              <p>If you haven&apos;t yet purchased a program please head over to our storefront to make the best decision future you could imagine!</p>
              <a href='https://joshua-paine-fitness-program.dpdcart.com/' target='_blank'
                className='px-6 py-2 my-4 bg-sky-700 text-white rounded-lg font-bold'>STORE</a>
              <p className='text-sm'><b>Note:</b> When signing up ensure you sign up with the <b>SAME</b> email address you used to make your purchase</p>
            </div>
          </div>
          <div className='p-4 text-sm'>
            <p>For support, enquiries or customer assitance please contact us via email: <b>painefit@gmail.com</b></p>
          </div>
        </main>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Home />
      </AuthenticatedTemplate>
    </>
  )
}

export default Index;