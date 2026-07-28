const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'apps/api/src/controllers');
const serverTsPath = path.join(__dirname, 'apps/api/src/server.ts');

const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('Controller.ts'));

let imports = '';
let routes = '';

files.forEach(file => {
    const className = file.replace('.ts', '');
    if (['LoginController', 'ProductController', 'ProductCategoryController', 'ProductRealmController'].includes(className)) return;

    imports += `import { ${className} } from './controllers/${className}';\n`;

    const content = fs.readFileSync(path.join(controllersDir, file), 'utf-8');
    const methodRegex = /public static (async\s+)?([a-zA-Z0-9_]+)/g;
    
    let match;
    const methods = [];
    while ((match = methodRegex.exec(content)) !== null) {
        methods.push(match[2]);
    }

    const routePrefix = className.replace('Controller', '').replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');

    routes += `\n// ${className.replace('Controller', '')}\n`;
    methods.forEach(method => {
        const lowerMethod = method.toLowerCase();
        let httpMethod = 'get';
        let routePath = `/${routePrefix}`;
        let middlewares = '';

        if (lowerMethod.includes('byid')) {
            httpMethod = 'get';
            routePath += '/:id';
        } else if (lowerMethod.includes('create')) {
            httpMethod = 'post';
            middlewares = `authMiddleware, requireRole(['ADMIN']), `;
        } else if (lowerMethod.includes('update')) {
            httpMethod = 'put';
            routePath += '/:id';
            middlewares = `authMiddleware, requireRole(['ADMIN']), `;
        } else if (lowerMethod.includes('delete') || lowerMethod.includes('remove')) {
            httpMethod = 'delete';
            routePath += '/:id';
            middlewares = `authMiddleware, requireRole(['ADMIN']), `;
        } else {
            httpMethod = 'get';
        }

        routes += `pgcoreRouter.${httpMethod}('${routePath}', ${middlewares}${className}.${method});\n`;
    });
});

let serverContent = fs.readFileSync(serverTsPath, 'utf-8');

// Insert imports after the last import
const lastImportIndex = serverContent.lastIndexOf('import ');
const endOfLastImport = serverContent.indexOf('\n', lastImportIndex) + 1;
serverContent = serverContent.slice(0, endOfLastImport) + imports + serverContent.slice(endOfLastImport);

// Insert routes before `app.use('/api', pgcoreRouter);`
const targetRouteStr = "app.use('/api', pgcoreRouter);";
const targetIndex = serverContent.indexOf(targetRouteStr);
serverContent = serverContent.slice(0, targetIndex) + routes + '\n' + serverContent.slice(targetIndex);

fs.writeFileSync(serverTsPath, serverContent);
console.log('Routes generated successfully.');
