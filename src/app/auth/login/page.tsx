
import { LoginForm } from './ui/LoginForm';

export default function LoginPage() {
  return (
    <div className='min-h-screen min-w-full flex flex-col justify-center items-center'>
      <div className="flex gap-2 lg:gap-4 items-center">
        <h1 className="font-black text-6xl md:text-6xl lg:text-7xl">
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0082ca] to-[#0082ca]">K-onnect</span>
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center mt-4 w-full">

        {/* <h1 className={` text-4xl mb-5 `}>Ingresar</h1> */}
        {/* <h2 className="font-bold text-2xl  md:text-3xl lg:text-5xl">
          <span className="underline decoration-dashed decoration-yellow-500 decoration-3 underline-offset-2">Sistema</span> para gestionar pedidos
        </h2> */}
        {/* <p className="text opacity-90 lg:text-xl ">
          Revisas las ordenes de tu tienda, gestiona tus productos, clientes y mucho mas.
        </p> */}

        <LoginForm />
      </div>
    </div>
  );
}