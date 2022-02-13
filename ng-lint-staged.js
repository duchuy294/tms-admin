const {
    exec
} = require('child_process');

const cwd = process.cwd();

const script = process.argv[2];

const files = process.argv
    .slice(3)
    .map((f) => {
        return `--files="${f.replace(cwd, '').slice(1)}"`;
    })
    .join(' ');

exec(
    `npm run ${script} -- --tsConfig=tsconfig.json --tslintConfig=tslint.json ${files} --fix=true`,
    (error, stdout) => {
        if (error) {
            console.log(stdout);
            process.exit(1);
        }
    }
);
