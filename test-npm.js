const { execSync } = require('child_process');
try {
  execSync('npm config set registry https://registry.npmmirror.com', { stdio: 'inherit' });
  execSync('npm view ws', { stdio: 'inherit' });
  console.log("NPM mirror is working");
} catch(e) {
  console.error("Failed", e);
}
