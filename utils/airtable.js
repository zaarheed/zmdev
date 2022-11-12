import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } from "@/constants/config";

const Airtable = require("airtable");

Airtable.configure({
    apiKey: AIRTABLE_API_KEY
});

const base = Airtable.base(AIRTABLE_BASE_ID);

const table = base(AIRTABLE_TABLE_NAME);

function getTable({ name }) {

    if (!name) return base(AIRTABLE_TABLE_NAME);

    return base(name);
}

export { table, getTable };