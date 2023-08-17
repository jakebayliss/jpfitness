import React, { useContext } from 'react';
import { User, UserContext } from '../auth/UserContext';
import { loginRequest } from '../auth/authConfig';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import Home from "./home";

const Index = () => {
  const { instance } = useMsal();
  const { accounts } = useMsal();
  const { user, setUser } = useContext<User>(UserContext);

  return (
    <>
      <UnauthenticatedTemplate>
        <main>
          <h1 className='page-title p-6 font-bold text-4xl text-white text-center'>Paine-Fit</h1>
          <div>
            <h3 className='text-center pt-6 font-bold'>Welcome to the start of your fitness journey!</h3>
            <div className='flex flex-col items-center gap-2 m-6 px-6 py-4 bg-white text-justify rounded-lg shadow-md'>
              <p>If you have already purchased a program please sign in below</p>
              <button className='px-6 py-3 secondary-colour rounded-lg font-bold'
                onClick={() => instance.loginPopup(loginRequest).then((response) => setUser(response.account))}>
                  SIGN IN
              </button>
              <p><b>Note:</b> When signing up ensure you sign up with the <b>SAME</b> email address you used to make your purchase</p>
            </div>
            <div className='flex flex-col items-center gap-2 m-6 px-6 py-4 bg-white text-justify rounded-lg shadow-md'>
              <p>If you haven't yet purchased a program please head over to our storefront to make the best decision future you could imagine!</p>
              <a href='https://joshua-paine-fitness-program.dpdcart.com/' target='_blank'
                className='px-6 py-3 secondary-colour rounded-lg font-bold'>STORE</a>
            </div>
            <div className='flex flex-col items-center gap-2 m-6 px-6 py-4 bg-white text-justify rounded-lg shadow-md'>
              <p>For support, enquiries or customer assitance please contact us via email: <b>painefit@gmail.com</b></p>
            </div>
          </div>
        </main>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Home workouts={null} />
      </AuthenticatedTemplate>
    </>
  )
}

export default Index;