import fs from 'fs/promises';

const basicContent = `# React Playground 🕹️🗒️. 

To create a new project go to \`/projects\` and run:\n \`npm create vite@latest the-name-of-your-project-folder -- --template react-ts\`` ;



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
