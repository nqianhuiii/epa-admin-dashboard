import * as logos from "@/assets/logos";


export async function getInvoiceTableData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return [
    {
      name: "Muhammad Ali bin Muaktar Alim Muhammad Ali bin Muaktar Alim",
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
      logo: logos.google,
    },
    {
      name: "Standard Package Muhammad Ali bin Muaktar Alim ",
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
      logo: logos.google,

    },
    {
      name: "Business Package",
      date: "2023-01-13T18:00:00.000Z",
      status: "Unpaid",
      logo: logos.google,

    },
    {
      name: "Standard Package",
      date: "2023-01-13T18:00:00.000Z",
      status: "Pending",
      logo: logos.google,
    },
  ];
}

export async function getTopChannels() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      name: "Google",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.google,
    },
    {
      name: "X.com",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.x,
    },
    {
      name: "Github",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.github,
    },
    {
      name: "Vimeo",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.vimeo,
    },
    {
      name: "Facebook",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.facebook,
    },
  ];
}
