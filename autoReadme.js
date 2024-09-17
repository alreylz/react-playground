import fs from 'fs/promises';

const basicContent = "# React Playground 🕹️🗒️";



(async () =>{

    //Read number of folders in the projects directory

   const projectsList = await fs.readdir('./projects');


    let content  = `${basicContent}\n\n`;
    projectsList.forEach( (val) => {
        content += `- [${val}](./projects/${val}/README.md)\n`
    })





    // Write to the Readme
    await fs.writeFile('./README.md', content, 'utf8');

})()