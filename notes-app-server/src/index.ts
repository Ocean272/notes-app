import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes);   
});

app.post("/api/notes", async (req: any, res: any) => {
    const { title, content } = req.body;

    if( !title || !content ) {
        return res.status(400).send("Title and Content fields required.");
    }

    try {
        const note = await prisma.note.create({
            data: { title, content }
        });
        res.json(note);

    } catch (err) {
        res.status(500).send("Oops, something went wrong!");
    }
});

app.put("/api/notes/:id", async ( req: any, res: any ) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);

    if ( !title || !content ) {
        return res.status(400).send("Title and Content fields required.");
    }

    if (!id || isNaN(id)) {
        return res.status(400).send("ID must be a valid number");
    }

    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content },
        });
        res.json(updatedNote);

    } catch (err) {
        res.status(500).send("Oops, something went wrong!");
    }
});

app.delete("/api/notes/:id", async ( req: any, res: any ) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
    return res.status(400).send("ID field required");
    }

    try {
        await prisma.note.delete({
            where: { id },
        });
        res.status(204).send();

    } catch (err) {
        res.status(500).send("Oops, something went wrong!")
    }
});

app.listen(5000, () => {
    console.log("server running in localhost:5000...");
});