
import { LoginForm } from './ui/LoginForm';

export default function LoginPage() {
  return (
    <div className='min-h-screen min-w-full flex flex-col justify-center items-center'>
      <div className="flex gap-2 md:gap-4 items-center">
        <h1 className="font-black text-5xl md:text-6xl lg:text-7xl mb-4">
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0082ca] to-[#0082ca]">K-onnect</span>
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center mt-4 w-full">
        <LoginForm />
      </div>
    </div>
  );
}