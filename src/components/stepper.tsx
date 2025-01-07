import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Stepper = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    step1: { name: "" },
    step2: { email: "" },
    step3: { password: "" },
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, stepKey: string) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], [e.target.name]: e.target.value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data: ", formData);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8">
        {["Paso 1", "Paso 2", "Paso 3"].map((label, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 text-center py-2 border-b-2",
              step === index + 1 ? "border-blue-500 font-bold" : "border-gray-300 text-gray-500"
            )}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <Input
              name="name"
              placeholder="Ingresa tu nombre"
              value={formData.step1.name}
              onChange={(e) => handleChange(e, "step1")}
              required
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <Input
              name="email"
              placeholder="Ingresa tu correo"
              value={formData.step2.email}
              onChange={(e) => handleChange(e, "step2")}
              type="email"
              required
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <Input
              name="password"
              placeholder="Ingresa tu contraseña"
              value={formData.step3.password}
              onChange={(e) => handleChange(e, "step3")}
              type="password"
              required
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Atrás
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext} disabled={step === 3}>
              Siguiente
            </Button>
          ) : (
            <Button type="submit">Enviar</Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Stepper;
