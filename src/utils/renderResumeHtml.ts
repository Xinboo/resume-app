import type { ResumeData, SkillEntry } from '../types/resume'

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function nl2br(str: string): string {
  return escapeHtml(str).replace(/\n/g, '<br />')
}

function formatPeriod(startDate: string, endDate: string, isCurrentJob: boolean): string {
  if (!startDate) return ''
  const [sy, sm] = startDate.split('-').map(Number)
  const start = `${sy}/${sm}`
  if (isCurrentJob) return `${start}-至今`
  if (!endDate) return start
  const [ey, em] = endDate.split('-').map(Number)
  return `${start}-${ey}/${em}`
}

function calcDuration(startDate: string, endDate: string, isCurrentJob: boolean): string {
  if (!startDate) return ''
  const [sy, sm] = startDate.split('-').map(Number)
  let ey: number, em: number
  if (isCurrentJob || !endDate) {
    const now = new Date()
    ey = now.getFullYear()
    em = now.getMonth() + 1
  } else {
    [ey, em] = endDate.split('-').map(Number)
  }
  let months = (ey - sy) * 12 + (em - sm)
  if (months < 0) return ''
  const years = Math.floor(months / 12)
  const rem = months % 12
  if (years > 0 && rem > 0) return `${years}年${rem}个月`
  if (years > 0) return `${years}年`
  return `${rem}个月`
}

function splitToTags(str: string): string {
  return str.split(/\s+/).filter(Boolean).map(s => `<span class="tag">${escapeHtml(s)}&nbsp;</span>`).join('')
}

function computeAge(birthYear: number, birthMonth: number): number {
  const now = new Date()
  let age = now.getFullYear() - birthYear
  if (now.getMonth() + 1 < birthMonth) age--
  return age
}

function renderSkillPair(a: SkillEntry, b?: SkillEntry): string {
  function skillClass(level: string) {
    if (level === '精通') return ''
    if (level === '熟练') return 'sl'
    if (level === '良好') return 'lh'
    return 'yb'
  }
  function renderOne(s: SkillEntry): string {
    return `<td class="tb2 cell ${skillClass(s.level)}" valign="top">
      <table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
        <td class="skill"><strong class="txt3">${escapeHtml(s.name)}</strong></td>
        <td valign="top"><span class="skbg"><span class="skco">${escapeHtml(s.level)}</span></span></td>
      </tr></tbody></table>
    </td>`
  }
  return `<tr>${renderOne(a)}${b ? renderOne(b) : '<td class="tb2 cell"></td>'}</tr>`
}

export function renderResumeHtml(data: ResumeData): string {
  const p = data.personalInfo
  const age = computeAge(p.birthYear, p.birthMonth)

  const skillRows: string[] = []
  for (let i = 0; i < data.skills.length; i += 2) {
    skillRows.push(renderSkillPair(data.skills[i], data.skills[i + 1]))
  }

  const workEntries = data.workExperience.map((w, i) => `
    <tr>
      <td class="${i > 0 ? 'p15 con pd_20' : 'p15 pd_20'}">
        <table cellspacing="0" cellpadding="0" border="0"><tbody>
          <tr>
            <td width="52" height="52" rowspan="2" class="companyLogo">
              <p>${w.logo ? `<img src="${escapeHtml(w.logo)}" alt="" width="48" height="48" />` : ''}<i></i></p>
            </td>
            <td class="phd tb1 p_12">
              <strong>${escapeHtml(w.company)}</strong><span class="gray">&nbsp;（${calcDuration(w.startDate, w.endDate, w.isCurrentJob)}）</span>
            </td>
            <td valign="top" class="time">${formatPeriod(w.startDate, w.endDate, w.isCurrentJob)}</td>
          </tr>
          <tr>
            <td valign="top" class="tb1 p_12" colspan="3"><span>${escapeHtml(w.role)}</span></td>
          </tr>
          <tr><td class="h_16" colspan="3"></td></tr>
          <tr>
            <td class="phd tb1 gray2" colspan="3">
              ${escapeHtml(w.industry)}${w.companySize ? `<span class="p5">|</span>${escapeHtml(w.companySize)}` : ''}${w.companyType ? `<span class="p5">|</span>${escapeHtml(w.companyType)}` : ''}
            </td>
          </tr>
          <tr>
            <td class="tb1" colspan="3">
              <table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
                <td valign="top" class="keys">工作描述：</td>
                <td valign="top" class="txt1">${nl2br(w.description)}</td>
              </tr></tbody></table>
            </td>
          </tr>
        </tbody></table>
      </td>
    </tr>`)

  const projectEntries = data.projectExperience.map((proj, i) => `
    <tr>
      <td class="p15${i > 0 ? '' : ''}">
        <table cellspacing="0" cellpadding="0" border="0"><tbody>
          <tr>
            <td class="phd tb1"><strong>${escapeHtml(proj.name)}</strong></td>
            <td valign="top" class="time">${formatPeriod(proj.startDate, proj.endDate, proj.isCurrentProject)}</td>
          </tr>
          ${proj.company ? `<tr><td class="tb1" colspan="2">
            <table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
              <td valign="top" class="keys">所属公司：</td>
              <td valign="top" class="txt1">${escapeHtml(proj.company)}</td>
            </tr></tbody></table>
          </td></tr>` : ''}
          ${proj.link ? `<tr><td class="tb1" colspan="2">
            <table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
              <td valign="top" class="keys">项目链接：</td>
              <td valign="top" class="txt1">${escapeHtml(proj.link)}</td>
            </tr></tbody></table>
          </td></tr>` : ''}
          <tr><td class="tb1" colspan="2">
            <table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
              <td valign="top" class="keys">项目描述：</td>
              <td valign="top" class="txt1">${nl2br(proj.description)}</td>
            </tr></tbody></table>
          </td></tr>
        </tbody></table>
      </td>
    </tr>`)

  const educationEntries = data.education.map(edu => `
    <tr>
      <td class="p15">
        <table cellspacing="0" cellpadding="0" border="0"><tbody>
          <tr>
            <td rowspan="2" class="schHead">
              ${edu.logo ? `<img src="${escapeHtml(edu.logo)}" alt="" width="52" height="52" />` : ''}
            </td>
            <td valign="top" class="rtbox p_12"><strong>${escapeHtml(edu.school)}</strong></td>
            <td valign="top" class="time schTime">${formatPeriod(edu.startDate, edu.endDate, false)}</td>
          </tr>
          <tr>
            <td class="rtbox p_12" colspan="2">${escapeHtml(edu.degree)} <span class="p5">|</span> ${escapeHtml(edu.major)}</td>
          </tr>
        </tbody></table>
      </td>
    </tr>`)

  const worksEntries = data.personalWorks.map(w => `
    <tr><td class="p15">
      <table cellspacing="0" cellpadding="0" border="0"><tbody>
        <tr>
          <td valign="top" class="keys">作品链接：</td>
          <td valign="top" class="txt1">${escapeHtml(w.link)}</td>
        </tr>
        <tr>
          <td valign="top" class="keys">作品描述：</td>
          <td valign="top" class="txt1">${escapeHtml(w.description)}</td>
        </tr>
      </tbody></table>
    </td></tr>`)

  return `<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  </head>
  <body>
    <style>
      html, body, div, p { margin: 0; padding: 0; }
      body { font-size: 14px; font-family: "microsoft yahei"; background-color: #ffffff; }
      table { border-collapse: collapse; border-spacing: 0; table-layout: fixed; }
      th, td { font-size: 14px; padding: 0; }
      a { text-decoration: none; }
      img { border: 0 none; }
      .blue { text-decoration: none; color: #3c3d5d; }
      .chead { width: 1002px; }
      .chead .logo { width: 698px; height: 90px; }
      .chead .txt { width: 152px; height: 90px; }
      .column { width: 1002px; line-height: 28px; border: 1px solid #dedede; }
      .column .hbox { width: 185px; height: 154px; }
      .column .head { display: block; background-color: #fafafa; }
      .column .box { width: 100%; background-color: #ffffff; border-top: 2px solid #f2f3f5; }
      .column .box1 { width: 100%; word-wrap: break-word; color: #ffffff; background-color: #3f4160; }
      .column .box2 { width: 100%; background-color: #f8f9fa; }
      .column .tba { width: 900px; padding: 0 50px 15px; }
      .column .tbb { width: 940px; padding: 0 30px; }
      .column .tb1 { width: 900px; line-height: 28px; color: #333333; word-break: break-all; padding-left: 0; padding-right: 0; }
      .column .tb2 { width: 450px; padding-left: 0; padding-right: 20px; }
      .column .tb3 { width: 900px; padding: 15px 20px 15px 0; }
      .column .gray, .column .gray2 { color: #999999; word-break: break-all; }
      .column .gray2 { color: #666666; }
      .column .plate1, .column .plate2 { width: 430px; height: 54px; font-size: 16px; font-weight: bold; color: #818ba3; }
      .column .plate1 { width: 900px; padding: 0 50px; }
      .column .plate1 .f16 { font-size: 14px; font-weight: normal; color: #333333; }
      .column .plate1 .f12 { font-size: 12px; font-weight: normal; color: #999999; }
      .column .keys, .column .keys2 { width: 85px; line-height: 28px; color: #666666; }
      .column .keys2 { width: 110px; }
      .column .txt1, .column .txt2, .column .txt3 { width: 815px; line-height: 28px; color: #333333; word-break: break-all; }
      .column .txt2 { width: 345px; }
      .column .txt3 { width: auto; max-width: 815px; font-size: 14px; font-weight: bold; }
      .column .txt4 { width: 305px; color: #ffffff; word-break: break-all; }
      .column .infr { width: 767px; color: #ffffff; table-layout: auto; }
      .column .vam, .column .grcha { vertical-align: middle; margin-left: 5px; }
      .column .box1 .vam { margin-right: 5px; margin-left: 0; }
      .column .name { font-size: 24px; padding-bottom: 18px; }
      .column .icard { color: #a1a3ae; padding-bottom: 18px; }
      .column .con { border-top: 1px dotted #ddd; }
      .column .pr20 { width: 225px; padding-right: 20px; }
      .column .time { width: 120px; line-height: 28px; color: #666666; padding-left: 20px; text-align: right; }
      .column .rtbox { width: 765px; line-height: 28px; color: #333333; padding: 0 20px 0 15px; word-break: break-all; }
      .column .hai, .column .guan { line-height: 18px; font-size: 12px; color: #ffffff; vertical-align: text-top; margin-left: 5px; padding: 1px 3px; background-color: #3cbe7f; border-radius: 2px; }
      .column .guan { background-color: #ff9f20; }
      .column .tag { display: inline-block; word-break: break-all; }
      .column .all { color: #666; padding: 10px 20px; background-color: #fafafa; }
      .column .tit { width: 900px; height: 40px; color: #666666; padding: 0 20px; background-color: #f5f5f5; }
      .column .p15 { padding: 15px 0; }
      .column .p5 { display: inline-block; color: #666666; padding: 0 5px; }
      .column .cell .skill { width: 165px; text-align: right; padding-right: 15px; }
      .column .cell .skbg, .column .cell .skco { display: inline-block; width: 245px; height: 18px; line-height: 18px; font-size: 12px; color: #ffffff; vertical-align: top; margin-top: 6px; background-color: #dddddd; border-radius: 20px; }
      .column .cell .skco { width: 235px; font-style: normal; margin-top: 0; padding-left: 10px; background-color: #ff9f20; z-index: 3; }
      .column .sl .skco { width: 173px; }
      .column .lh .skco { width: 112px; }
      .column .yb .skco { width: 51px; }
      .column .fbox strong { font-size: 14px; font-weight: bold; }
      .column .cha { font-size: 12px; font-weight: normal; color: #00457d; margin-left: 5px; }
      .column .cha1 { font-size: 14px; }
      .column .cha:hover { color: #ff6000; }
      .column .email { width: 330px; }
      .column .bbf { border-bottom: 1px dotted #ddd; }
      .column .pd_20 { padding-left: 20px; padding-right: 20px; }
      .h_16 { height: 16px; }
      .schHead img { display: block; }
      .column .schGood { line-height: 18px; font-size: 12px; color: #f87203; vertical-align: text-top; margin-left: 4px; padding: 1px 3px; background-color: #ffede5; border-radius: 2px; }
      .column .p_12 { padding-left: 12px; }
      .column .schTime { width: 115px; }
      .companyLogo p { width: 50px; height: 50px; background: #f0f0f0; border-radius: 8px; border: 1px solid #dddddd; text-align: center; overflow: hidden; }
      .companyLogo p img { display: inline-block; vertical-align: middle; max-width: 100%; max-height: 100%; }
      .companyLogo p i { display: inline-block; height: 100%; width: 0; vertical-align: middle; }

      .eng td, .eng .txt3, .eng .fbox strong { font-size: 13px; font-family: "Arial"; }
      .eng .txt1, .eng .rtbox, .eng .phd { width: 775px; font-size: 13px; font-family: "Arial"; line-height: 28px; }
      .eng .txt2 { width: 305px; }
      .eng .txt4 { width: 245px; }
      .eng .cell .txt3 { width: 120px; }
      .eng .time, .eng .keys { width: 110px; font-size: 13px; text-align: right; }
      .eng .cell .skill { width: 130px; }
      .eng .phd { padding-left: 145px; }
      .eng .keys { padding-right: 15px; }
      .eng .pr20 { width: 205px; }
      .eng .pr20 .keys { width: 100px; }
      .eng .email { width: 270px; }
    </style>
    <table cellpadding="0" cellspacing="0" align="center" bgcolor="#fff" class="column"><tbody><tr><td valign="top">
      <!--基本信息-->
      <table cellspacing="0" cellpadding="0" border="0" class="box1"><tbody><tr>
        <td class="hbox" align="middle">
          <img src="https://img01.51jobcdn.com/im/2021/avatar/male/avatar_toc_male01.png" width="85" height="104" class="head" alt="头像" />
        </td>
        <td>
          <table cellspacing="0" cellpadding="0" border="0" class="infr"><tbody>
            <tr><td colspan="2" class="name">${escapeHtml(p.name)}</td></tr>
            <tr><td valign="top" colspan="3"><p>
              <img class="vam" src="https://img01.51jobcdn.com/im/2016/resume/y4.png" width="20" height="20" />
              ${escapeHtml(p.gender)} <span class="p5">|</span> ${age} 岁 (${p.birthYear}/${String(p.birthMonth).padStart(2, '0')})
              <span class="p5">|</span> ${p.workYears}年工作经验
              <span class="p5">|</span> ${escapeHtml(p.politicalStatus)}
              <span class="p5">|</span> 现居住${escapeHtml(p.currentCity)}
            </p></td></tr>
            <tr>
              <td valign="top">
                <img class="vam" src="https://img01.51jobcdn.com/im/2016/resume/y2.png" width="20" height="20" />${escapeHtml(p.phone)}
              </td>
              <td valign="top">
                <table cellspacing="0" cellpadding="0" border="0" class="email"><tbody><tr>
                  <td valign="top" width="25"><img class="vam" src="https://img01.51jobcdn.com/im/2016/resume/y3.png" width="20" height="20" /></td>
                  <td valign="top" class="txt4">${escapeHtml(p.email)}</td>
                </tr></tbody></table>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr></tbody></table>
      <!--自我评价-->
      <table cellspacing="0" cellpadding="0" border="0" class="box"><tbody>
        <tr><td class="plate1">个人优势</td></tr>
        <tr><td class="tba">
          <table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
            <td class="tb1">${nl2br(data.strengths)}</td>
          </tr></tbody></table>
        </td></tr>
      </tbody></table>
      <!--求职意向-->
      <table cellspacing="0" cellpadding="0" border="0" class="box"><tbody>
        <tr><td class="plate1">求职意向</td></tr>
        <tr><td class="tba">
          <table cellspacing="0" cellpadding="0" border="0"><tbody>
            <tr><td class="p15 bbf">
              <table cellspacing="0" cellpadding="0" border="0"><tbody>
                <tr>
                  <td class="tb2" valign="top"><table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
                    <td valign="top" class="keys">期望职位：</td>
                    <td valign="top" class="txt2">${splitToTags(data.jobIntention.targetPositions)}</td>
                  </tr></tbody></table></td>
                  <td class="tb2" valign="top"><table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
                    <td valign="top" class="keys">期望城市：</td>
                    <td valign="top" class="txt2">${splitToTags(data.jobIntention.targetCities)}</td>
                  </tr></tbody></table></td>
                </tr>
                <tr>
                  <td class="tb2" valign="top"><table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
                    <td valign="top" class="keys">期望月薪：</td>
                    <td valign="top" class="txt2">${escapeHtml(data.jobIntention.salaryRange)}</td>
                  </tr></tbody></table></td>
                  <td class="tb2" valign="top"><table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
                    <td valign="top" class="keys">期望行业：</td>
                    <td valign="top" class="txt2">${splitToTags(data.jobIntention.industry)}</td>
                  </tr></tbody></table></td>
                </tr>
                <tr>
                  <td class="tb2" valign="top"><table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
                    <td valign="top" class="keys">工作类型：</td>
                    <td valign="top" class="txt2">${escapeHtml(data.jobIntention.jobType)}</td>
                  </tr></tbody></table></td>
                </tr>
              </tbody></table>
            </td></tr>
          </tbody></table>
        </td></tr>
        <td class="tba">
          <table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
            <td class="tb2" valign="top"><table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
              <td valign="top" class="keys">求职状态：</td>
              <td valign="top" class="txt2">${escapeHtml(data.jobIntention.jobStatus)}</td>
            </tr></tbody></table></td>
            <td class="tb2" valign="top"><table cellspacing="0" cellpadding="0" border="0"><tbody><tr>
              <td valign="top" class="keys">到岗时间：</td>
              <td valign="top" class="txt2">${escapeHtml(data.jobIntention.availability)}</td>
            </tr></tbody></table></td>
          </tr></tbody></table>
        </td>
      </tbody></table>
      <!--工作经验-->
      <table cellspacing="0" cellpadding="0" border="0" class="box"><tbody>
        <tr><td class="plate1">工作经验</td></tr>
        <tr><td class="tbb">
          <table cellspacing="0" cellpadding="0" border="0">
            ${workEntries.join('')}
          </table>
        </td></tr>
      </tbody></table>
      <!--项目经验-->
      <table cellspacing="0" cellpadding="0" border="0" class="box"><tbody>
        <tr><td class="plate1">项目经验</td></tr>
        <tr><td class="tba">
          <table cellspacing="0" cellpadding="0" border="0">
            ${projectEntries.join('')}
          </table>
        </td></tr>
      </tbody></table>
      <!--教育经历-->
      <table class="box"><tbody>
        <tr><td class="plate1">教育经历</td></tr>
        <tr><td class="tba">
          <table cellspacing="0" cellpadding="0" border="0">
            ${educationEntries.join('')}
          </table>
        </td></tr>
      </tbody></table>
      <!--技能特长-->
      <table cellspacing="0" cellpadding="0" border="0" class="box"><tbody>
        <tr><td class="plate1">技能特长</td></tr>
        <tr><td class="tbb">
          <table cellspacing="0" cellpadding="0" border="0"><tbody>
            <tr><td class="tit">技能/语言</td></tr>
            <tr><td class="p15">
              <table cellspacing="0" cellpadding="0" border="0"><tbody>
                ${skillRows.join('')}
              </tbody></table>
            </td></tr>
          </tbody></table>
        </td></tr>
      </tbody></table>
      <!--个人作品-->
      <table class="box"><tbody>
        <tr><td class="plate1">个人作品</td></tr>
        <tr><td class="tba">
          <table cellspacing="0" cellpadding="0" border="0">
            ${worksEntries.join('')}
          </table>
        </td></tr>
      </tbody></table>
    </td></tr></tbody></table>
  </body>
</html>`
}
