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
  "in_1NpzmlJsmUwKwZ5azRPnPytg",
  "in_1NotSNJsmUwKwZ5alusyovYV",
  "in_1NekzBJsmUwKwZ5ahFUtK9qC",
  "in_1NdHnaJsmUwKwZ5aSOIC5NgW",
  "in_1NZ40bJsmUwKwZ5a8gtnD07q",
  "in_1NTWDOJsmUwKwZ5aWWSNtdbx",
  "in_1NS30OJsmUwKwZ5aLffEuMin",
  "in_1NLPy7JsmUwKwZ5aeEsRamOY",
  "in_1NIe9cJsmUwKwZ5aExNjgB7Y",
  "in_1NHYsGJsmUwKwZ5aAktzuIBh",
  "in_1NHXeQJsmUwKwZ5avelxSqiZ",
  "in_1NHAp1JsmUwKwZ5a7qNEZAZU",
  "in_1N7P9jJsmUwKwZ5aoWjNbdhX",
  "in_1N7Bn8JsmUwKwZ5aTqsPkPwU",
  "in_1N5whSJsmUwKwZ5agEqGqezg",
  "in_1N24X6JsmUwKwZ5aiRli3SMM",
  "in_1MwWrtJsmUwKwZ5au2hz9gKL",
  "in_1Mv3cpJsmUwKwZ5aNsWjYrrs",
  "in_1MtmoEJsmUwKwZ5apvdSn2dU",
  "in_1MqZAKJsmUwKwZ5aGWe4JxaU",
  "in_1MqYMGJsmUwKwZ5aGxy4cY0n",
  "in_1MqLo7JsmUwKwZ5aXTyJtC7P",
  "in_1MlI4zJsmUwKwZ5ajcr7SHkk",
  "in_1Mo48bJsmUwKwZ5a8vJY4xyD",
  "in_1MkXghJsmUwKwZ5a4zBX6Nja",
  "in_1MkD1UJsmUwKwZ5aZSkpfFbx",
  "in_1MkBjyJsmUwKwZ5aLZE0q2Yo",
  "in_1MjorkJsmUwKwZ5amaVsLCjL",
  "in_1MjOMdJsmUwKwZ5ajrmToJaf",
  "in_1Mj7IaJsmUwKwZ5alDErisg7",
  "in_1MioTsJsmUwKwZ5auP2yFEYQ",
  "in_1MijErJsmUwKwZ5aMDgSLsRd",
  "in_1MiY0eJsmUwKwZ5a3zFFQWZq",
  "in_1MiKzvJsmUwKwZ5aNDICGRcS",
  "in_1MiL02JsmUwKwZ5alpCRUxBD",
  "in_1MhcxDJsmUwKwZ5a2fUcgACF",
  "in_1Mb8jwJsmUwKwZ5aAaQWgczo",
  "in_1Mf4f7JsmUwKwZ5aZDrLbr5Y",
  "in_1Mel2zJsmUwKwZ5aHG2pG3uc",
  "in_1McDioJsmUwKwZ5aQJOQIiKB",
  "in_1MamOYJsmUwKwZ5a210cybzY",
  "in_1Mag6iJsmUwKwZ5aSjVGdxMU",
  "in_1MXTZrJsmUwKwZ5ada5fQdjn",
  "in_1MaOJkJsmUwKwZ5a6IHdQaRv",
  "in_1MZfWqJsmUwKwZ5a3diKjAw6",
  "in_1MYf6cJsmUwKwZ5aPnAeWj5s",
  "in_1MYZwtJsmUwKwZ5aKNqK8OIz",
  "in_1MYOe8JsmUwKwZ5a4wgPeHdS",
  "in_1MYBgGJsmUwKwZ5anjXkB794",
  "in_1MYBgFJsmUwKwZ5alWFRc5JS",
  "in_1MY9MnJsmUwKwZ5aApXlakJ0",
  "in_1MXWlvJsmUwKwZ5aj3eiWHpp",
  "in_1MXWm9JsmUwKwZ5amIGhXm2n",
  "in_1MXTZsJsmUwKwZ5abJ7VofRQ",
  "in_1MXTBgJsmUwKwZ5anObjcvMw",
  "in_1MWKtVJsmUwKwZ5ahnM5hsn9",
  "in_1MVRe6JsmUwKwZ5a1ylNtAEK",
  "in_1MVGrnJsmUwKwZ5a4gW8UGsR",
  "in_1MUxi1JsmUwKwZ5aPcUmnuLQ",
  "in_1MUxgaJsmUwKwZ5agFJxTPkl",
  "in_1MTpsxJsmUwKwZ5aZVtqhG3P",
  "in_1MTps1JsmUwKwZ5a4pUtw67d",
  "in_1MS1ZBJsmUwKwZ5ayqhcFVd3",
  "in_1MQdNdJsmUwKwZ5a9vRNOTTY",
  "in_1MPtxcJsmUwKwZ5aOnx7NK6L",
  "in_1MPtn3JsmUwKwZ5aC1SGHbPA",
  "in_1MPXblJsmUwKwZ5aMyp7kgCs",
  "in_1MOQjsJsmUwKwZ5al6a6lY6Y",
  "in_1MOMKxJsmUwKwZ5aIJNZZwVD",
  "in_1MNi5eJsmUwKwZ5aFeZSkNSL",
  "in_1MNQKQJsmUwKwZ5aNrYhcVh2",
  "in_1MNLH0JsmUwKwZ5aCZo0zGjv",
  "in_1MNLCFJsmUwKwZ5arOcspXi8",
  "in_1MNKF5JsmUwKwZ5a9nVnzAC3",
  "in_1MNKF1JsmUwKwZ5a7dIbys5k",
  "in_1MN9rzJsmUwKwZ5aDZg2Ob1J",
  "in_1MMwuDJsmUwKwZ5awlUvmiTv",
  "in_1MMwsEJsmUwKwZ5amb0hvkTc",
  "in_1MMuaIJsmUwKwZ5aj7t9tcvP",
  "in_1MMGdoJsmUwKwZ5a94BBjibw",
  "in_1MMEoIJsmUwKwZ5axgmlFGuQ",
  "in_1MMEoJJsmUwKwZ5autC8R1Si",
  "in_1MMEoJJsmUwKwZ5aE8bmtxkP",
  "in_1MMEoIJsmUwKwZ5a4kLLIhSD",
  "in_1MMEoHJsmUwKwZ5a9bfh1tE2",
  "in_1MMEnGJsmUwKwZ5a6uf2nG3G",
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
