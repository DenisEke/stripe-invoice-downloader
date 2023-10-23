import axios from "axios";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2023-08-16",
});

const IDS = [
  "",
  // place ids to download here, get the unified payment csv
];

downloadInvoices()
  .then(() => {
    console.log("Done");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

async function downloadInvoices() {
  let i = 0;
  for (const id of IDS) {
    const invoice = await stripe.invoices.retrieve(id);

    console.log("Downloading invoice", ++i, "of", IDS.length);
    if (!invoice.invoice_pdf) {
      console.log("No invoice PDF for invoice", invoice.id);
      continue;
    }

    try {
      const response = await axios.get(invoice.invoice_pdf, {
        responseType: "stream",
      });

      // check if directory exists
      if (
        !fs.existsSync(
          "./downloads/" +
            invoice.customer_address.country +
            "/" +
            invoice.status
        )
      ) {
        fs.mkdirSync(
          "./downloads/" +
            invoice.customer_address.country +
            "/" +
            invoice.status,
          { recursive: true }
        );
      }

      const writer = fs.createWriteStream(
        "./downloads/" +
          invoice.customer_address.country +
          "/" +
          invoice.status +
          "/" +
          invoice.id +
          ".pdf"
      );
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    } catch (error) {
      console.error("Error downloading the PDF:", error);
      throw error;
    }
  }

  return;
}

/*
DOWNLOADS ALL THE INVOICES
let invoices = [];

  let res = await stripe.invoices.list({
    limit: 100,
  });
  invoices.push(...res.data);

  while (res.has_more) {
    console.log("looping...", res.has_more, res.data.length, "invoices");
    res = await stripe.invoices.list({
      limit: 100,
      starting_after: res.data[res.data.length - 1].id,
      created: {
        lte: Math.floor(new Date("2023-01-01T00:00:00Z").getTime() / 1000),
        gt: Math.floor(new Date("2022-01-01T00:00:00Z").getTime() / 1000),
      },
    });
    invoices.push(...res.data);
  }

  // filter all >0
  invoices = invoices.filter((invoice) => invoice.total > 0);

  // filter all year 2022
  invoices = invoices.filter(
    (invoice) => new Date(invoice.created * 1000).getFullYear() === 2022
  );

  console.log(invoices.length);

  // count paid, open and void invoices
  const paid = invoices.filter((invoice) => invoice.status === "paid");
  const open = invoices.filter((invoice) => invoice.status === "open");
  const voided = invoices.filter((invoice) => invoice.status === "void");
  const draft = invoices.filter((invoice) => invoice.status === "draft");
  const uncollectible = invoices.filter(
    (invoice) => invoice.status === "uncollectible"
  );

  console.log("paid", paid.length);
  console.log("open", open.length);
  console.log("void", voided.length);
  console.log("draft", draft.length);
  console.log("uncollectible", uncollectible.length);

  // for each invoice
  let i = 0;
  for (const invoice of invoices) {
    console.log("Downloading invoice", ++i, "of", invoices.length);
    if (!invoice.invoice_pdf) {
      console.log("No invoice PDF for invoice", invoice.id);
      continue;
    }

    try {
      const response = await axios.get(invoice.invoice_pdf, {
        responseType: "stream",
      });

      // check if directory exists
      if (
        !fs.existsSync(
          "./downloads/" +
            invoice.customer_address.country +
            "/" +
            invoice.status
        )
      ) {
        fs.mkdirSync(
          "./downloads/" +
            invoice.customer_address.country +
            "/" +
            invoice.status,
          { recursive: true }
        );
      }

      const writer = fs.createWriteStream(
        "./downloads/" +
          invoice.customer_address.country +
          "/" +
          invoice.status +
          "/" +
          invoice.id +
          ".pdf"
      );
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    } catch (error) {
      console.error("Error downloading the PDF:", error);
      throw error;
    }
  }
*/
