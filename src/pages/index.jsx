import React, { useState, useEffect, useRef } from 'react';
import { fetchProfile, fetchCredit } from '@services/api/user';

import storage from '@services/utils/authToken';
import { setAuth } from '@services/api';
import { useRouter } from 'next/router';
const Home = () => {
  const router = useRouter();
  const [info, setInfo] = useState(null);
  const [credit, setCredit] = useState();

  const isMounted = useRef();

  useEffect(() => {
    if (isMounted.current) {
      return;
    }

    storage.getToken().then((data) => {
      let { accessToken } = data;
      if (accessToken) {
        let { refreshToken } = storage.getToken();
        setAuth({ accessToken, refreshToken }, true);

        // loadData()
      } else {
        setInfo(false);
      }
    });

    isMounted.current = true;
  }, []);

  const logoutUser = () => {
    storage.removeToken();

    router.push('/login');
  };

  // if (info === null) {
  //   return "Loading...";
  // }
  const loadData = () => {
    fetchProfile().then((data) => {
      setInfo(data);
    });
    fetchCredit().then((data) => {
      setCredit(data);
    });
  };

  return (
    <main>
      {info && credit ? (
        <>
          <h2>Welcome {info.fullname}</h2>
          <p>Your Credit: {credit.credit}</p>
          <div className="menu">
            <button onClick={logoutUser}>logout</button>
          </div>
        </>
      ) : (
        <button onClick={loadData}>Load data</button>
      )}
    </main>
  );
};

export default Home;
