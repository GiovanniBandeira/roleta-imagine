# 🎰 Imagine – Sistema de Roleta com Cupons

## Arquivos do projeto

| Arquivo | Função |
|---|---|
| `index.html` | Roleta principal – o cliente gira aqui |
| `cupom.html` | Exibe o cupom quando o QR Code é escaneado |
| `admin.html` | Painel do lojista para validar cupons |
| `apps-script.gs` | Backend Google Sheets (cole no Apps Script) |

---

## ⚙️ Configuração em 5 passos

### 1. Criar a Planilha Google
1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma nova planilha
2. Copie o **ID** da URL: `https://docs.google.com/spreadsheets/d/**SEU_ID_AQUI**/edit`

### 2. Criar o Apps Script (backend)
1. Acesse [script.google.com](https://script.google.com)
2. Crie um **Novo Projeto**
3. Cole todo o conteúdo de `apps-script.gs`
4. Substitua `COLE_O_ID_DA_SUA_PLANILHA_AQUI` pelo ID copiado
5. Execute a função `setupSheet()` uma vez para criar os cabeçalhos
6. Vá em **Implantar → Nova Implantação**
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
7. Copie a **URL de implantação** gerada

### 3. Hospedar os arquivos HTML
- Use **GitHub Pages**, **Vercel**, **Netlify** ou qualquer hospedagem estática
- O `cupom.html` precisa de uma URL pública para que o QR Code funcione

### 4. Configurar a URL nos arquivos HTML
Em `index.html`, `cupom.html` e `admin.html`, localize:
```javascript
const CONFIG = {
  APPS_SCRIPT_URL: 'SUA_URL_DO_APPS_SCRIPT_AQUI',
  COUPON_BASE_URL: 'https://SEU_SITE/cupom.html',  // só no index.html
};
```
Substitua pelos valores reais.

### 5. Ajustar a senha de admin
Em `admin.html` e `apps-script.gs`, mude:
```javascript
ADMIN_PASSWORD: 'imagine2024'  // para a senha que preferir
```

---

## 🎯 Como funciona o fluxo

```
Cliente gira a roleta
   ↓
Sistema sorteia o prêmio (pesos configurados)
   ↓
Gera ID único (#XXXXXX)
   ↓
Salva no Google Sheets: ID | Prêmio | Data | ATIVO
   ↓
Gera QR Code → URL: seusite.com/cupom.html?id=#XXXXXX
   ↓
Cliente baixa o "ingresso" como imagem
   ↓
Na loja: lojista escaneia o QR Code
   ↓
Abre admin.html → busca o cupom → verifica status
   ↓
Clica "Marcar como Utilizado" → status muda para USADO
   ↓
QR Code fica inválido permanentemente
```

## 🎲 Probabilidades da Roleta

| Prêmio | Probabilidade | Segmentos na roleta |
|---|---|---|
| 🏷️ 10% de Desconto | 49,5% | 3 segmentos |
| 🔑 Chaveiro Imagine | 49,5% | 3 segmentos |
| ⭐ 50% no Projeto | 1% | 3 segmentos |
