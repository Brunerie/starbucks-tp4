'use client';

import {useEffect, useState} from "react";
import {getUser} from "../../utils/supabase";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/gotrue-js/src/lib/types"
import {Button, SectionContainer} from "tp-kit/components";
import {useRouter} from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<Session>();
  const supabase = createClientComponentClient();

  useEffect(() => {
    getUser(supabase).then((user) => {
      // @ts-ignore
      if (user.session) {
        // @ts-ignore
        setUser(user.session)
      } else {
        router.push('/connexion')
      }
    })
  }, []);

  return (
      <SectionContainer>
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <p className="text-2xl my-3">
            MON COMPTE
          </p>
          <p className="my-4">
            Bonjour, {user?.user.user_metadata.name} !
          </p>
          <div className="my-4">
            <p>
              Nom : {user?.user.user_metadata.name}
            </p>
            <p>
              Email : {user?.user.email}
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