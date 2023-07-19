import { appendFileSync, readFileSync, writeFileSync } from "fs";
import openai from "./utils/openai";
import { join } from "path";
import { ChatCompletionRequestMessage } from "openai";
import readFilesInSubdirectorySync from "./utils/readFilesInSubdirectorySync";

function saveToDisk(input:string,output: string) {
    const id = Date.now();
    console.log("New Chat Completion: " + id);
    console.log(output);
    appendFileSync(join(__dirname, "messages", "index.md"), `\n{"${id}":"${input}"}`);
    writeFileSync(join(__dirname, "messages", `${id}.md`), output);
    appendFileSync(join(__dirname, "public","log.md"), `
    ${"``` JSON"}
    ${input}
    ${output}
    ${"```"}
    `, "utf-8");

}
export default async function chat(input: string) {
    try {
        console.log("Starting Chat Bot");
        const initMessages: ChatCompletionRequestMessage[] = [
            { role: "system", content: readFilesInSubdirectorySync(join(__dirname, "src")) },
            { role: "system", content: readFileSync(join(__dirname, "init", "system.txt"), "utf-8") },
            { role: "assistant", content: readFileSync(join(__dirname, "init", "assistant.txt"), "utf-8") }
        ]
        const chatCompletion: any = await openai.createChatCompletion({
            user: "chat_gpt",
            model: "gpt-4",
            messages: initMessages.concat({ role: "user", content: input }),
        }).catch((reason) => {
            console.log("error in chat completion");
            console.log(reason.data);
            return reason;
        });
        saveToDisk(input,chatCompletion.data.choices[0].message?.content)
        return chatCompletion.data.choices[0].message?.content;
    } catch (error) {
        console.error(error);
        return error;
    }
}