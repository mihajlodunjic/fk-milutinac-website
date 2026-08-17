import { contacts } from "./business";

export const facilities = [
  {
    key: "balloon",
    name: "Balon sa veštačkom travom",
    description:
      "Prostor za fudbal, mali fudbal, trening i rekreativnu igru. Aktuelnu dostupnost termina proverite telefonom.",
    contact: contacts.balloon,
    href: "/sportski-kompleks/"
  },
  {
    key: "openFields",
    name: "Otvoreni fudbalski tereni",
    description:
      "Otvoreni tereni deo su sportskog kompleksa FK Milutinac. Za uslove korišćenja i dostupnost obratite se klubu.",
    contact: contacts.operations,
    href: "/sportski-kompleks/"
  },
  {
    key: "birthdays",
    name: "Dečji rođendani uz fudbal",
    description:
      "Rođendan može da se provede na terenu, uz fudbal i druženje. Detalji organizacije dogovaraju se direktno sa Milutincem.",
    contact: contacts.birthdays,
    href: "/fudbalski-rodjendani/"
  },
  {
    key: "restaurant",
    name: "Restoran i proslave",
    description:
      "Na istoj lokaciji nalazi se Restoran Milutinac, sa ponudom domaće kuhinje i prostorom za privatna i poslovna okupljanja.",
    contact: contacts.restaurantPrimary,
    href: "/restoran-i-proslave/"
  }
] as const;
