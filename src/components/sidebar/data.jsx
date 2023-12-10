import React from "react";
import {
  BsFillHouseFill,
  BsFillFileEarmarkMedicalFill,
  BsFillFileEarmarkPlusFill,
  BsFacebook,
  BsFillEnvelopeAtFill,
  BsFillTelephoneFill,
} from "react-icons/bs";
import { IoMdPersonAdd } from "react-icons/io";

export const links = [
  {
    id: 1,
    url: "/home",
    text: "Generar Documento",
    icon: <BsFillHouseFill />,
  },
  {
    id: 2,
    url: "/docs",
    text: "Documentos",
    icon: <BsFillFileEarmarkMedicalFill />,
  },
  {
    id: 3,
    url: "/add",
    text: "Agregar Documento",
    icon: <BsFillFileEarmarkPlusFill />,
  },
  {
    id: 4,
    url: "/register",
    text: "Registrar Usuario",
    icon: <IoMdPersonAdd />,
  },
];

export const social = [
  {
    id: 1,
    url: "https://www.facebook.com/profile.php?id=100063732420657",
    icon: <BsFacebook />,
  },
  {
    id: 2,
    url: "https://mail.google.com/mail/u/0/?ogbl#inbox?compose=new",
    icon: <BsFillEnvelopeAtFill />,
  },
  {
    id: 3,
    url: "https://web.whatsapp.com", // (+51) 969 237 089
    icon: <BsFillTelephoneFill />,
  },
];
