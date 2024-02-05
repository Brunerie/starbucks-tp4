"use client";
import React, {useCallback, useEffect, useState} from 'react';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { TextInput, PasswordInput, Box } from '@mantine/core';
import {Button, NoticeMessage} from 'tp-kit/components';
import {getUser} from "../../../utils/supabase";
import {useZodI18n} from "tp-kit/components/providers";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {useRouter} from "next/navigation";


const schema = z.object({
    email: z.string().email().nonempty(),
    password: z.string().min(6)
});

type FormValues = z.infer<typeof schema>;

export default function Connexion(){
    useZodI18n(z);
    const form = useForm<FormValues>({
        initialValues: {
            email: '',
            password: '',
        },

        validate: zodResolver(schema),
    });

    const supabase = createClientComponentClient();

    const [created, setCreated] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [message, setMessage] = useState("");

    const router = useRouter();

    useEffect(() => {
        getUser(supabase).then((user) => {
            // @ts-ignore
            if (user.session) {
                router.refresh()
                router.push('/mon-compte')
            }
        });
    }, []);

    const handleSubmit = async (values: FormValues) => {
        const { error } = await supabase.auth.signInWithPassword(
            {
                email: values.email,
                password: values.password,
            }
        )

        if (!error) {
            router.refresh()
            router.push('/mon-compte')
        }

        setCreated(true);
        setMessage((error) ? error.message : "Vous êtes connecté")
        setIsValid((!error))
    }


    return (
        <Box maw={400} mx="auto">
            <form
                className="flex items-center flex-col space-y-6 w-"
                onSubmit={form.onSubmit((values) => handleSubmit(values))}
            >
                <p
                    className="text-left w-full text-2xl"
                >
                    Connexion
                </p>

                {
                    created &&
                    <NoticeMessage
                        type={isValid ? "success" : "error"}
                        message={message}
                    />
                }

                <TextInput
                    className="w-full"
                    required
                    label="Adresse email"
                    {...form.getInputProps('email')}
                />

                <PasswordInput
                    className="w-full"
                    required
                    label="Mot de passe"
                    {...form.getInputProps('password')}
                />

                <Button
                    className="w-full cursor-pointer"
                    type="submit"
                >
                    Se connecter
                </Button>

                <a onClick={() => router.push('/inscription')} className="">Créer un compte</a>
            </form>
        </Box>
    );
};