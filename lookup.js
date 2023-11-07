import select from "@inquirer/select";
import input from "@inquirer/input";
import fs from "node:fs";

const prompts = {
  message: "Phonebook",
  choices: [
    {
      name: "search for a person",
      value: "search",
    },
    {
      name: "add person",
      value: "add",
    },
    {
      name: "delete person",
      value: "delete",
    },
    {
      name: "change number",
      value: "update",
    },
    {
      name: "print phonebook",
      value: "print",
    },
    {
      name: "exit",
      value: "exit",
    },
  ],
};

const actions = {
  async search(phonebook) {
    const { name, phoneNumber } = await select(phonebook);
    console.log(`${name}'s phone number is: ${phoneNumber}`);
  },
  async add(phonebook) {
    const name = await input({
      message: "Enter name",
    });
    const phoneNumber = await input({
      message: "Enter phone number",
    });
    phonebook.choices.push({ name, value: { name, phoneNumber } });
    phonebook.choices.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    console.log(`${name} successfully added`);
  },
  async update(phonebook) {
    const { name } = await select(phonebook);

    const personIndex = phonebook.choices.findIndex((p) => p.name === name);

    phonebook.choices[personIndex].value.phoneNumber = await input({
      message: `Enter ${name} new number`,
    });
    console.log(`${name} phone number has been successfully updated`);
  },
  async delete(phonebook) {
    const { name } = await select(phonebook);
    const person = phonebook.choices.findIndex((p) => p.name === name);
    const deletedPerson = phonebook.choices.splice(person, 1)[0];
    console.log(`${deletedPerson.name} successfully deleted`);
  },
  async print(phonebook) {
    console.log(
      JSON.stringify(
        phonebook.choices.map(
          ({ value: { name, phoneNumber } }) => `${name}: ${phoneNumber}`
        ),
        null,
        2
      )
    );
  },
  async exit() {},
};

async function main() {
  const phonebook = {
    message: "People",
    choices: JSON.parse(fs.readFileSync("phonebook.json", "utf8")).map(
      (person) => ({ name: person.name, value: person })
    ),
  };
  let answer;
  while (answer !== "exit") {
    answer = await select(prompts);
    await actions[answer](phonebook);
  }
}

main();
