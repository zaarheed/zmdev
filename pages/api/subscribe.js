import { getTable } from "@/utils/airtable";

export default async function Subscribe(req, res) {
    try {
        const payload = req.body;
        const _records = await getTable("email-subscribers").create([{ fields: payload }]);
        const records = _records.map(record => ({
            ...record.fields
        }));
        
        res.json(records);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "An unknown error occured" });
    }
}