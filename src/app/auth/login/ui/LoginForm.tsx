"use client";

import { useEffect } from 'react';
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { IoInformationOutline } from "react-icons/io5";
import clsx from 'clsx';
import { authenticate } from '@/actions/auth/login';
import { Loader2 } from 'lucide-react';
// import { useRouter } from 'next/navigation';

export const LoginForm = () => {


  // const router = useRouter();
  const [state, dispatch] = useFormState(authenticate, undefined);


  useEffect(() => {
    if (state === 'Success') {
      // redireccionar
      // router.replace('/');
      window.location.replace('/');
    }

  }, [state]);



  return (
    <form action={dispatch} className="flex flex-col w-[500px] p-10 border rounded-md  mt-20 ">


      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border bg-gray-50 rounded-md mb-5"
        type="email"
        name="email"
      />

      <label htmlFor="email">Contraseña</label>
      <input
        className="px-5 py-2 border bg-gray-50 rounded-md mb-5"
        type="password"
        name="password"
      />

      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {state === "CredentialsSignin" && (
          <div className="flex flex-row mb-2">
            <IoInformationOutline className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">
              Credenciales no son correctas
            </p>
          </div>
        )}
      </div>

      <LoginButton />

    </form>
  );
};

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={clsx("flex items-center justify-center rounded-md", {
        "btn-primary": !pending,
        "btn-disabled": pending
      })}
      disabled={pending}
    >
      {pending ? <><Loader2 className="animate-spin" /> Ingresando...</> : <>Ingresar</>}
    </button>
  );
}
