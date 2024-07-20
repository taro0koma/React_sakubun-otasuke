import React, { useEffect, useState } from "react";
import { supabase } from "../lib/helper/supabaseClient";

export default function LoginPage() {
  const [user, setUser] = useState(null);

  const login = async () => {
    const {error} = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo:window.location.origin,
      },
    });
    if(error){
      console.error('Error logging in: ', error.message);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out: ', error.message);
    } else {
      setUser(null); // Reset user state to null after logging out
    }
  };

  // useEffect(() => {
  //   const session = supabase.auth.getSession();
  //   setUser(session?.user);
  // }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
    };

    getSession();
  }, []);


  return (
    <div>
      {user ? (
        <div>
        <h1>Authenticated</h1>
        <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login with Github</button>
      )}
    </div>
  );
};