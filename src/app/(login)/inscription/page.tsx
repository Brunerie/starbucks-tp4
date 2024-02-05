"use client";
import {PRODUCTS_CATEGORY_DATA} from "tp-kit/data";
import {Button, NoticeMessage, NoticeMessageData, SectionContainer} from "tp-kit/components";
import {z} from 'zod';
import {useForm, zodResolver} from '@mantine/form';
import {PasswordInput, TextInput, Box} from '@mantine/core';
import React, {useEffect, useState} from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import {useZodI18n} from "tp-kit/components/providers";
import {getUser} from "../../../utils/supabase";


const schema = z.object({
    name: z.string().min(1, {message: 'La chaîne doit contenir au moins 1 caractère(s)'}),
    email: z.string().email({message: 'email non valide'}),
    password: z.string().min(6, {message: 'La chaîne doit contenir au moins 6 caractère(s)'}),
});

type FormValues = z.infer<typeof schema>;


export default function Inscription(){
    useZodI18n(z);
    const form = useForm<FormValues>({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },

        validate: zodResolver(schema),
    });

    useEffect(() => {
        getUser(supabase).then((user) => {
            // @ts-ignore
            if (user.session) {
                router.push('/mon-compte')
            }
        });
    }, []);

    const supabase = createClientComponentClient();

    const router = useRouter();

    const [created, setCreated] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (values: FormValues) => {
        const { error } = await supabase.auth.signUp(
            {
                email: values.email,
                password: values.password,
                options: {
                    emailRedirectTo: 'http://localhost:3000/api/auth/callback',
                    data: {
                        name: values.name
                    }
                }
            }
        )

        setCreated(true);
        setMessage((error) ? error.message : "Vous êtes inscrit, un email de confirmation vous a été envoyé")
        setIsValid((!error))
    }

    return (
        <Box maw={400} mx="auto">
            <form
                className="flex items-center flex-col space-y-6 w- my-10"
                onSubmit={form.onSubmit((values) => handleSubmit(values))}
            >
                <p
                    className="text-left w-full text-2xl"
                >
                    Inscription
                </p>

                {
                    created &&
                    <NoticeMessage
                        className="w-full"
                        type={isValid ? "success" : "error"}
                        message={message}
                    />
                }

                <TextInput
                    className="w-full"
                    required
                    label="Nom"
                    description="Le nom qui sera utilisé pour vos commandes"
                    {...form.getInputProps('name')}
                />

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
                    S&apos;inscrire
                </Button>

                <a onClick={() => router.push('/connexion')} className="">Déjà un compte ? Se connecter</a>
            </form>
        </Box>
    );
}
