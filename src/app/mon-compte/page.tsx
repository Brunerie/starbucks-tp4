'use client';

import {useEffect, useState} from "react";
import {getUser} from "../../utils/supabase";
import {createClientComponentClient, User} from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/gotrue-js/src/lib/types"
import {Button, SectionContainer} from "tp-kit/components";
import {useRouter} from "next/navigation";

export default function Page() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userDetails, setUserDetails] = useState<User | null >(null);

  useEffect(() => {
    const getData = async () => {
      const user = await getUser(supabase);
      console.log(user?.user_metadata.name);
      if (user) {
        setUserDetails(user);
      } else {
        router.push('/connexion');
      }
    };
    getData();
  }, []);

  return (
      <SectionContainer>
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <p className="text-2xl my-3">
            MON COMPTE
          </p>
          <p className="my-4">
            Bonjour, {userDetails?.user_metadata.name} !
          </p>
          <div className="my-4">
            <p>
              Nom : {userDetails?.user_metadata.name}
            </p>
            <p>
              Email : {userDetails?.email}
            </p>
          </div>
          <Button
              onClick={() => {
                supabase.auth.signOut().then(() => {
                  router.refresh()
                })
              }}
              variant="outline" className="w-full mt-4"
          >
            Se déconnecter
          </Button>
        </div>
      </SectionContainer>
  )
}