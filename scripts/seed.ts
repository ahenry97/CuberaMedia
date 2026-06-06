import { resetDataWithSeed } from "../src/lib/db/store";

async function main() {
  const data = await resetDataWithSeed();

  console.log("Seeded local development data.");
  console.log("Customer login: customer@example.com / Password123!");
  console.log("Developer login: developer@example.com / Password123!");
  console.log(`Profiles: ${data.profiles.length}`);
  console.log(`Projects: ${data.projects.length}`);
  console.log(`Work items: ${data.workItems.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
