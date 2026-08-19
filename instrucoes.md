# Sistema de Ponto DK — configuração

Este repositório é uma versão pública e sanitizada de um projeto real de controle interno de ponto.
Nenhum funcionário, e-mail, URL de Apps Script, credencial ou dado operacional real está incluído.

## Arquitetura

**Navegador → Netlify Function → Google Apps Script → Google Sheets / Drive**

O frontend nunca recebe a URL real do Apps Script. Ela fica na variável de ambiente `APPS_SCRIPT_URL` do Netlify.

## Estrutura

```text
.
├── index.html
├── sw.js
├── _headers
├── netlify.toml
├── netlify/
│   └── functions/
│       └── ponto.js
├── Code.gs
├── README.md
└── instrucoes.md
```

## 1. Google Sheets / Apps Script

1. Crie uma planilha no Google Sheets.
2. Abra **Extensões → Apps Script**.
3. Cole o conteúdo de `Code.gs`.
4. Em **Configurações do projeto → Propriedades do script**, crie opcionalmente:
   - `EMAIL_RELATORIO`: e-mail que receberá o relatório mensal.
5. Implante como **App da Web** e copie a URL `/exec`.
6. Na planilha, abra o menu **Ponto → Configurar funcionários iniciais**.
7. Substitua os funcionários de exemplo pelos cadastros desejados ou use o menu para adicionar novos.

> Os IDs são gerados por UUID e não devem ser reutilizados para pessoas diferentes.

## 2. Netlify

1. Publique este repositório no GitHub.
2. No Netlify, escolha **Import an existing project → GitHub**.
3. O `netlify.toml` já aponta os arquivos estáticos e a pasta de Functions.
4. Em **Environment variables**, crie:
   - `APPS_SCRIPT_URL`: URL `/exec` criada no Apps Script.
5. Faça o deploy.

## 3. Funcionamento offline

- A página é armazenada pelo `sw.js` depois do primeiro acesso online.
- Se não houver internet no momento da batida, o evento é salvo no `localStorage`.
- O mesmo `eventId` é preservado durante retry e sincronização posterior.
- O backend usa idempotência para impedir que o mesmo evento gere duas linhas.
- O horário do toque é preservado para eventos offline, sujeito a validações no servidor.

## 4. Concorrência e idempotência

A parte crítica do registro usa `LockService` para que duas requisições simultâneas não escolham o mesmo tipo de batida.
Foto e geocodificação são processadas depois da gravação principal, fora do lock.

## 5. Fotos e localização

Fotos criadas pelo Apps Script permanecem privadas no Google Drive por padrão nesta versão pública.
Latitude e longitude são validadas antes do uso. A conversão para endereço depende do serviço de geocodificação do Google Apps Script.

## 6. Relatório mensal

O projeto pode gerar um resumo mensal com:

- dias trabalhados;
- total de horas;
- atrasos;
- saídas antecipadas;
- horas extras.

O envio por e-mail só ocorre se `EMAIL_RELATORIO` estiver configurado nas Script Properties.

## 7. Limitações

Este projeto foi criado para **controle interno e aprendizado prático**. Não é apresentado como sistema oficial de registro eletrônico de ponto em conformidade jurídica ou trabalhista.

O exemplo também não implementa autenticação de usuário. Antes de usar em ambiente maior ou com dados sensíveis, adicione uma camada de autenticação/autorização adequada.
