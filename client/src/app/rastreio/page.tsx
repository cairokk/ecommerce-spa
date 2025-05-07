"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  { label: "Pedido Realizado", active: true },
  { label: "Aguardando Pagamento", active: true },
  { label: "Saiu para Entrega", active: false },
  
];

//Pagina não utilizada, passei pra id dinamico

export default function Page() {
  return (
    <main className="w-full min-h-screen flex justify-center pt-28 bg-white px-4">
      <section className="flex flex-col items-center h-full p-10 w-full shadow-md max-w-3xl justify-between">
        <h1 className="text-3xl font-bold text-center mb-4">
          Rastreio de Pedido
        </h1>
        <p className="text-center text-gray-600">
          A viagem do seu café <span className="font-bold">continua</span> —
          rastreie seu <br/> pedido com status em tempo real.
        </p>

        <div className="relative w-full flex justify-between items-center mt-12 ">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center w-full"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  step.active ? "bg-black text-white" : "bg-gray-300 text-black"
                }`}
              >
                {index + 1}
              </motion.div>
              <p className="text-center text-sm font-medium w-24">
                {step.label}
              </p>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-end gap-3 items-center mt-12">
          <button className="outline-1 outline-black rounded-2xl pl-7 pr-7 pt-2 pb-2">
            Ajuda
          </button>
          <button className="bg-black text-white rounded-2xl pl-7 pr-7 pt-2 pb-2">
            Voltar
          </button>
        </div>
      </section>
    </main>
  );
}
