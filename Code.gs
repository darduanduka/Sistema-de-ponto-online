# Netlify
.netlify/

# Node (caso alguma function passe a usar dependências no futuro)
node_modules/
npm-debug.log*
yarn-error.log*
package-lock.json

# Variáveis de ambiente locais — NUNCA commitar a URL do Apps Script ou segredos aqui.
# A variável real (APPS_SCRIPT_URL) fica configurada no painel do Netlify, não em arquivo.
.env
.env.local
.env.*.local

# Sistema operacional / editor
.DS_Store
Thumbs.db
.vscode/
.idea/

# Pacotes temporários gerados durante testes
*.zip
