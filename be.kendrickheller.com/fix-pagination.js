const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('skip: page * size')) {
                content = content.replace(/skip:\s*page\s*\*\s*size/g, 'skip: (page > 0 ? page - 1 : 0) * size');
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Replaced in ' + fullPath);
            }
        }
    }
}

replaceInDir('d:/workspace/kendrickheller.com/be.kendrickheller.com/apps/api/src/services');
