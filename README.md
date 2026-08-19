# Sistema de Ponto DK

Sistema web de controle interno de ponto desenvolvido para registrar entradas e saídas de funcionários usando Google Sheets como base de dados.

O projeto nasceu de uma necessidade real e foi usado como parte do meu aprendizado em desenvolvimento de sistemas, automação e integração entre serviços.

## O que o projeto faz

- cadastro e seleção de funcionários;
- registro de entrada, saída para almoço, retorno e saída final;
- Event ID único por batida;
- prevenção de registros duplicados;
- controle de concorrência com `LockService`;
- funcionamento offline com fila local;
- sincronização posterior mantendo o mesmo Event ID;
- captura de foto e localização;
- histórico diário por funcionário;
- relatório mensal de horas, atrasos e saídas antecipadas.

## Arquitetura

```text
Celular / navegador
       |
       v
Netlify Function
       |
       v
Google Apps Script
       |
       +--> Google Sheets
       +--> Google Drive
```

A Netlify Function funciona como um gateway de origem única entre o navegador e o Apps Script. A URL real do backend fica em variável de ambiente e não é enviada ao frontend.

## Pontos técnicos que trabalhei

### Idempotência

Cada toque em **Bater Ponto** gera um `eventId`. O mesmo identificador é reutilizado em retry, timeout e sincronização offline. O backend verifica se o ID já existe antes de gravar uma nova linha.

### Concorrência

A escolha do próximo tipo de batida e a gravação da linha acontecem dentro de uma seção protegida pelo `LockService`, reduzindo risco de duas requisições simultâneas gerarem registros inconsistentes.

### Offline

Quando não há conexão, o evento é armazenado no navegador e sincronizado depois. O horário original do toque é preservado e validado pelo servidor.

### Gateway serverless

O frontend chama uma Netlify Function em vez de acessar diretamente o Apps Script. Isso evita o fluxo cross-origin direto do navegador e mantém a URL real do backend no servidor.

## Tecnologias utilizadas

- JavaScript
- HTML / CSS
- Google Apps Script
- Google Sheets
- Google Drive
- Service Worker
- Netlify Functions

## Estrutura

```text
.
├── index.html
├── sw.js
├── Code.gs
├── _headers
├── netlify.toml
├── netlify/
│   └── functions/
│       └── ponto.js
└── instrucoes.md
```

## Segurança e privacidade

Esta é uma **versão pública sanitizada** do projeto.

Não estão incluídos:

- nomes de funcionários reais;
- e-mails operacionais reais;
- URL real do Apps Script;
- credenciais ou tokens;
- dados de ponto reais;
- fotos ou informações pessoais.

As configurações privadas devem ficar em variáveis de ambiente ou Script Properties.

## Limitações

O sistema foi desenvolvido para controle interno e aprendizado prático. Não é apresentado como solução oficial de ponto eletrônico com conformidade jurídica/trabalhista.

A versão de exemplo não possui autenticação de usuário e deve receber uma camada de autenticação/autorização antes de uso em cenários maiores ou com maior sensibilidade de dados.

## Sobre o desenvolvimento

Ainda estou aprofundando meus conhecimentos técnicos. O projeto foi construído e evoluído com apoio de inteligência artificial, documentação, testes e pesquisa, como parte do meu aprendizado prático em Análise e Desenvolvimento de Sistemas.

## Autor

**Darduan da Silva Paulo**  
Estudante de Análise e Desenvolvimento de Sistemas
