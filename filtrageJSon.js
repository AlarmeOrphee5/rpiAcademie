const fs = require("fs");
const path = require("path");

const modulesDir = "./modules";

for (const dir of fs.readdirSync(modulesDir)) {

    const modulePath = path.join(modulesDir, dir, "module.json");

    if (!fs.existsSync(modulePath))
        continue;

    try {

        const moduleData = JSON.parse(
            fs.readFileSync(modulePath, "utf8")
        );
        
        if(moduleData.test.refresh == 0) console.log(`✅ ${dir}`);

    } catch (err) {

        console.error(`❌ ${dir}`);
        console.error(err.message);

    }
}

console.log("terminée.");