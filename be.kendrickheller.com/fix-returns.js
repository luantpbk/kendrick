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
            let modified = false;
            
            // We want to replace cases where services return:
            // return {
            //     total,
            //     data,
            //     page,
            //     size
            // };
            // (with variations in whitespace)
            
            const regex = /return\s*\{\s*total,\s*data(?:,\s*page,\s*size)?\s*\};/g;
            if (regex.test(content)) {
                content = content.replace(regex, 'return { count: total, items: data, page, size };');
                modified = true;
            }

            // Also check for user customer type service mapping
            // return { total, data: data.map(...), page, size };
            const regex2 = /return\s*\{\s*total,\s*data:\s*(.+?),\s*page,\s*size\s*\};/g;
            if (regex2.test(content)) {
                content = content.replace(regex2, 'return { count: total, items: $1, page, size };');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed returns in ' + fullPath);
            }
        }
    }
}

replaceInDir('d:/workspace/kendrickheller.com/be.kendrickheller.com/apps/api/src/services');
