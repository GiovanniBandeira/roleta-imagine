// ═══════════════════════════════════════════════════════
// IMAGINE – Sistema de Cupons | Google Apps Script
//
// COMO USAR (método mais fácil):
// 1. Abra sua planilha Google Sheets
// 2. Menu: Extensões → Apps Script
// 3. Apague o que tiver e cole ESTE código inteiro
// 4. Salve (Ctrl+S) e execute setupSheet() UMA VEZ
// 5. Depois: Implantar → Nova Implantação → App da Web
// ═══════════════════════════════════════════════════════

const SHEET_NAME = 'Cupons';
const ADMIN_PASSWORD = 'imagine2024'; // Mude para sua senha

// ── GET: buscar ou salvar cupom ───────────────────────────
function doGet(e) {
  const action = e.parameter.action;
  const id = e.parameter.id;

  if (action === 'get' && id) {
    return output(getCoupon(id));
  }

  // Salvar via GET (chamado com no-cors do browser)
  if (action === 'save' && id) {
    const prize      = e.parameter.prize      || '';
    const prizeLabel = e.parameter.prizeLabel || '';
    return output(saveCoupon(id, prize, prizeLabel));
  }

  return output({ error: 'Ação inválida' });
}

// ── POST: salvar ou usar cupom ────────────────────────────
function doPost(e) {
  let data;
  try { data = JSON.parse(e.postData.contents); }
  catch(err) { return output({ error: 'JSON inválido' }); }

  if (data.action === 'save') return output(saveCoupon(data.id, data.prize, data.prizeLabel));
  if (data.action === 'use')  return output(useCoupon(data.id, data.password));

  return output({ error: 'Ação inválida' });
}

// ── PEGAR A ABA ───────────────────────────────────────────
function getSheet() {
  // Usa a planilha onde o script está vinculado (sem precisar de ID)
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

// ── BUSCAR CUPOM ──────────────────────────────────────────
function getCoupon(id) {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === id) {
      return {
        id:         rows[i][0],
        prize:      rows[i][1],
        prizeLabel: rows[i][2],
        date:       rows[i][3],
        status:     rows[i][4],
        usedDate:   rows[i][5] || null,
      };
    }
  }
  return { error: 'Cupom não encontrado' };
}

// ── SALVAR CUPOM ──────────────────────────────────────────
function saveCoupon(id, prize, prizeLabel) {
  if (!id || !prize) return { error: 'Dados inválidos' };

  const sheet = getSheet();
  const existing = getCoupon(id);
  if (!existing.error) return { error: 'Cupom já existe' };

  sheet.appendRow([id, prize, prizeLabel, new Date().toISOString(), 'ATIVO', '']);
  return { success: true, id: id };
}

// ── USAR/INVALIDAR CUPOM ──────────────────────────────────
function useCoupon(id, password) {
  if (password !== ADMIN_PASSWORD) return { error: 'Senha incorreta' };

  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === id) {
      if (rows[i][4] === 'USADO') return { error: 'Cupom já foi utilizado' };
      sheet.getRange(i + 1, 5).setValue('USADO');
      sheet.getRange(i + 1, 6).setValue(new Date().toISOString());
      return { success: true };
    }
  }
  return { error: 'Cupom não encontrado' };
}

// ── HELPER ────────────────────────────────────────────────
function output(data) {
  const res = ContentService.createTextOutput(JSON.stringify(data));
  res.setMimeType(ContentService.MimeType.JSON);
  return res;
}

// ── SETUP: execute UMA VEZ para criar os cabeçalhos ──────
// Selecione esta função no menu e clique em Executar ▶️
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheet();

  // Sempre sobrescreve o cabeçalho para garantir
  sheet.getRange(1, 1, 1, 6).setValues([['ID', 'Prêmio (chave)', 'Prêmio (nome)', 'Data de emissão', 'Status', 'Data de uso']]);
  sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  sheet.getRange(1, 1, 1, 6).setBackground('#1a1a2e');
  sheet.getRange(1, 1, 1, 6).setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 180);
  sheet.setColumnWidth(6, 180);

  // Log para confirmar qual planilha foi usada
  Logger.log('✅ Configurado com sucesso!');
  Logger.log('📄 Planilha: ' + ss.getName());
  Logger.log('📋 Aba: ' + sheet.getName());
  Logger.log('🔗 URL: ' + ss.getUrl());
}
