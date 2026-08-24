import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  get,
  ref
} from "firebase/database";

import { auth, db } from "../firebase/config";


const AuthContext =
  createContext(null);


export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null);

  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async firebaseUser => {

          if (!firebaseUser) {

            setUser(null);
            setProfile(null);
            setLoading(false);

            return;
          }


          setUser(firebaseUser);


          try {

            const snapshot =
              await get(
                ref(
                  db,
                  `users/${firebaseUser.uid}`
                )
              );


            if (snapshot.exists()) {

              setProfile({

                id: firebaseUser.uid,

                ...snapshot.val()

              });

            } else {

              setProfile({

                id: firebaseUser.uid,

                email:
                  firebaseUser.email,

                role: "user"

              });

            }

          } catch (error) {

            console.error(
              "Greska profila:",
              error
            );

            setProfile({

              id: firebaseUser.uid,

              email:
                firebaseUser.email,

              role: "user"

            });

          }


          setLoading(false);

        }
      );


    return unsubscribe;

  }, []);


  async function login(
    email,
    password
  ) {

    const result =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    return result.user;

  }


  async function logout() {

    await signOut(auth);

  }


  return (

    <AuthContext.Provider
      value={{

        user,

        profile,

        loading,

        login,

        logout,

        role:
          profile?.role || null,

        isSuperAdmin:
          profile?.role ===
          "superadmin",

        isOwner:
          profile?.role ===
          "owner",

        isUser:
          profile?.role ===
          "user"

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


export function useAuth() {

  return useContext(
    AuthContext
  );

}