// 企查查Lite - Vercel Serverless Function
// 数据源：百度百科
// 部署路径: /api/search?name=企业名

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { name } = req.query;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ code: 400, msg: '请输入至少2个字符的企业名称', data: null });
  }

  try {
    const data = await searchCompany(name.trim());
    if (data) {
      return res.json({ code: 200, msg: 'success', data });
    }
    return res.json({ code: 404, msg: `未查到「${name}」的企业信息`, data: null });
  } catch (err) {
    return res.status(500).json({ code: 500, msg: '查询失败：' + err.message, data: null });
  }
}

async function searchCompany(name) {
  let html = await fetchPage(`https://baike.baidu.com/item/${encodeURIComponent(name)}`);

  if (!html) {
    html = await fetchPage(`https://baike.baidu.com/search?word=${encodeURIComponent(name)}`);
    if (!html) return null;
    const link = extractSearchLink(html);
    if (link) {
      html = await fetchPage(link);
    }
  }

  if (!html) return null;
  return parsePage(html, name);
}

async function fetchPage(url) {
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html', 'Accept-Language': 'zh-CN,zh;q=0.9' },
      redirect: 'follow',
    });
    if (!resp.ok) return null;
    return await resp.text();
  } catch {
    return null;
  }
}

function extractSearchLink(html) {
  const m = html.match(/<a[^>]*href="(\/item\/[^"]+)"[^>]*>/);
  return m ? 'https://baike.baidu.com' + m[1] : null;
}

function parsePage(html, originalName) {
  const info = {};

  // 标题
  const title = html.match(/<title>([^<]+?)<\/title>/);
  if (title) info.name = title[1].replace(/_百度百科$/, '').trim();

  // 摘要
  for (const p of [/class="lemmaDesc[^"]*"[^>]*>([\s\S]*?)<\/div>/, /class="para"[^>]*>([\s\S]*?)<\/div>/]) {
    const m = html.match(p);
    if (m) { info.abstract = clean(m[1]).slice(0, 500); break; }
  }

  // 基本信息表 (dt/dd)
  const dtRe = /<dt[^>]*class="basicInfoItem[^"]*"[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*class="basicInfoItem[^"]*"[^>]*>([\s\S]*?)<\/dd>/g;
  let match;
  while ((match = dtRe.exec(html)) !== null) {
    const label = clean(match[1]);
    const value = clean(match[2]);
    if (label && value) info[label] = value;
  }

  // 字段映射
  const map = {
    '公司名称': 'name', '法定代表人': 'legal_person', '注册资本': 'registered_capital',
    '成立时间': 'founded_date', '总部地点': 'address', '经营范围': 'scope',
    '所属行业': 'industry', '公司类型': 'company_type', '员工数': 'employees',
    '创始人': 'founder', '年营业额': 'revenue', '董事长': 'chairman',
    '成立日期': 'founded_date', '总部': 'address',
  };

  const result = { source: '百度百科' };
  let hasData = false;
  for (const [cn, en] of Object.entries(map)) {
    if (info[cn]) { result[en] = info[cn]; hasData = true; }
  }
  if (info.abstract) result.abstract = info.abstract;
  if (!result.name) result.name = originalName;
  return hasData ? result : null;
}

function clean(t) {
  return t.replace(/<[^>]+>/g, '').replace(/\[(\d+(?:-\d+)?)\]/g, '')
    .replace(/\s+/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").trim();
}
