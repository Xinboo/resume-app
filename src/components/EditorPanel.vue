<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { ResumeData, SkillLevel } from '../types/resume'
import { renderResumeHtml } from '../utils/renderResumeHtml'

const props = defineProps<{ data: ResumeData }>()
const emit = defineEmits<{ save: [] }>()

const activeSection = ref<string | null>(null)
const isDirty = ref(false)
const showMenu = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

watch(() => props.data, () => { isDirty.value = true }, { deep: true })

function onClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    showMenu.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

function getFileName(ext: string) {
  const name = props.data.personalInfo.name || '简历'
  const date = new Date().toISOString().slice(0, 10)
  return `简历-${name}-${date}.${ext}`
}

function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

function exportJson() {
  const raw = localStorage.getItem('resume-data')
  if (!raw) { alert('没有可导出的数据'); return }
  downloadBlob(new Blob([raw], { type: 'application/json' }), getFileName('json'))
  showMenu.value = false
}

function importJson() {
  fileInputRef.value?.click()
  showMenu.value = false
}

function onFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      JSON.parse(reader.result as string)
      localStorage.setItem('resume-data', reader.result as string)
      location.reload()
    } catch {
      alert('JSON 文件格式无效')
    }
  }
  reader.readAsText(file)
  ;(e.target as HTMLInputElement).value = ''
}

function exportHtml() {
  const html = renderResumeHtml(props.data)
  downloadBlob(new Blob([html], { type: 'text/html' }), getFileName('html'))
  showMenu.value = false
}

function resetData() {
  if (confirm('确定要重置所有数据吗？')) {
    localStorage.removeItem('resume-data')
    location.reload()
  }
  showMenu.value = false
}

function exportPdf() {
  const html = renderResumeHtml(props.data)
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.left = '-9999px'
  document.body.appendChild(iframe)
  iframe.contentDocument!.write(html)
  iframe.contentDocument!.close()
  iframe.contentWindow!.onafterprint = () => document.body.removeChild(iframe)
  setTimeout(() => iframe.contentWindow!.print(), 300)
  showMenu.value = false
}

function handleSave() {
  emit('save')
  isDirty.value = false
}

function openPreview() {
  const html = renderResumeHtml(props.data)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}

const skillLevels: SkillLevel[] = ['精通', '熟练', '良好', '一般']
const now = new Date()
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

function toggle(section: string) {
  activeSection.value = activeSection.value === section ? null : section
}

function addWorkEntry() {
  props.data.workExperience.push({
    id: crypto.randomUUID(), logo: '', company: '', startDate: '', endDate: '', isCurrentJob: false,
    role: '', industry: '', companySize: '', companyType: '', description: '',
  })
}

function removeWorkEntry(i: number) {
  props.data.workExperience.splice(i, 1)
}

function addProjectEntry() {
  props.data.projectExperience.push({
    id: crypto.randomUUID(), name: '', startDate: '', endDate: '', isCurrentProject: false, company: '', link: '', description: '',
  })
}

function removeProjectEntry(i: number) {
  props.data.projectExperience.splice(i, 1)
}

function addEducationEntry() {
  props.data.education.push({
    id: crypto.randomUUID(), logo: '', school: '', startDate: '', endDate: '', degree: '本科', major: '',
  })
}

function removeEducationEntry(i: number) {
  props.data.education.splice(i, 1)
}

function addSkillEntry() {
  props.data.skills.push({ id: crypto.randomUUID(), name: '', level: '熟练' })
}

function removeSkillEntry(i: number) {
  props.data.skills.splice(i, 1)
}

function addWorkEntry2() {
  props.data.personalWorks.push({ id: crypto.randomUUID(), link: '', description: '' })
}

function removeWorkEntry2(i: number) {
  props.data.personalWorks.splice(i, 1)
}

const showDonate = ref(false)
</script>

<template>
  <div class="editor-panel">
    <div class="editor-header">
      <div class="header-left">
        <h2>简历编辑</h2>
        <a class="preview-link" href="#" @click.prevent="openPreview">预览</a>
      </div>
      <div class="header-right">
        <button class="save-btn" :class="{ disabled: !isDirty }" :disabled="!isDirty" @click="handleSave">保存</button>
        <div class="menu-wrapper" ref="menuRef">
          <button class="menu-btn" @click.stop="showMenu = !showMenu">操作 ▾</button>
          <div v-show="showMenu" class="menu-dropdown">
            <div class="menu-item" @click="exportJson">导出 JSON</div>
            <div class="menu-item" @click="importJson">导入 JSON</div>
            <div class="menu-item" @click="exportHtml">导出 HTML</div>
            <div class="menu-item" @click="exportPdf">导出 PDF</div>
            <div class="menu-item menu-item-danger" @click="resetData">重置</div>
          </div>
        </div>
        <input ref="fileInputRef" type="file" accept=".json" style="display:none" @change="onFileSelected" />
      </div>
    </div>

    <div class="sections">
      <!-- 个人信息 -->
      <div class="section" :class="{ open: activeSection === 'personalInfo' }">
        <div class="section-title" @click="toggle('personalInfo')">
          <span>基本信息</span>
          <span class="arrow">›</span>
        </div>
        <div v-show="activeSection === 'personalInfo'" class="section-body">
          <div class="field-row">
            <div class="field">
              <label>姓名</label>
              <input v-model="data.personalInfo.name" />
            </div>
            <div class="field">
              <label>性别</label>
              <select v-model="data.personalInfo.gender">
                <option>男</option><option>女</option>
              </select>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>出生年份</label>
              <input v-model.number="data.personalInfo.birthYear" type="number" />
            </div>
            <div class="field">
              <label>出生月份</label>
              <input v-model.number="data.personalInfo.birthMonth" type="number" min="1" max="12" />
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>工作年限</label>
              <input v-model.number="data.personalInfo.workYears" type="number" />
            </div>
            <div class="field">
              <label>政治面貌</label>
              <select v-model="data.personalInfo.politicalStatus">
                <option value="中共党员">中共党员</option>
                <option value="中共预备党员">中共预备党员</option>
                <option value="共青团员">共青团员</option>
                <option value="民主党派人士">民主党派人士</option>
                <option value="无党派民主人士">无党派民主人士</option>
                <option value="普通公民">普通公民</option>
              </select>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>电话</label>
              <input v-model="data.personalInfo.phone" />
            </div>
            <div class="field">
              <label>邮箱</label>
              <input v-model="data.personalInfo.email" />
            </div>
          </div>
          <div class="field">
            <label>现居城市</label>
            <input v-model="data.personalInfo.currentCity" />
          </div>
          <div class="field">
            <label>头像</label>
            <input v-model="data.personalInfo.avatar" placeholder="url / base64" />
          </div>
        </div>
      </div>

      <!-- 个人优势 -->
      <div class="section" :class="{ open: activeSection === 'strengths' }">
        <div class="section-title" @click="toggle('strengths')">
          <span>个人优势</span>
          <span class="arrow">›</span>
        </div>
        <div v-show="activeSection === 'strengths'" class="section-body">
          <div class="field">
            <label>个人优势</label>
            <textarea v-model="data.strengths" class="auto-height"></textarea>
          </div>
        </div>
      </div>

      <!-- 求职意向 -->
      <div class="section" :class="{ open: activeSection === 'jobIntention' }">
        <div class="section-title" @click="toggle('jobIntention')">
          <span>求职意向</span>
          <span class="arrow">›</span>
        </div>
        <div v-show="activeSection === 'jobIntention'" class="section-body">
          <div class="field-row">
            <div class="field">
              <label>期望职位</label>
              <input v-model="data.jobIntention.targetPositions" />
            </div>
            <div class="field">
              <label>期望城市</label>
              <input v-model="data.jobIntention.targetCities" />
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>期望月薪</label>
              <input v-model="data.jobIntention.salaryRange" />
            </div>
            <div class="field">
              <label>期望行业</label>
              <input v-model="data.jobIntention.industry" />
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>工作类型</label>
              <select v-model="data.jobIntention.jobType">
                <option>全职</option><option>兼职</option><option>实习</option>
              </select>
            </div>
            <div class="field">
              <label>求职状态</label>
              <input v-model="data.jobIntention.jobStatus" />
            </div>
          </div>
          <div class="field">
            <label>到岗时间</label>
            <input v-model="data.jobIntention.availability" />
          </div>
        </div>
      </div>

      <!-- 工作经验 -->
      <div class="section" :class="{ open: activeSection === 'workExperience' }">
        <div class="section-title" @click="toggle('workExperience')">
          <span>工作经验</span>
          <span class="arrow">›</span>
        </div>
        <div v-show="activeSection === 'workExperience'" class="section-body">
          <div v-for="(w, i) in data.workExperience" :key="w.id" class="entry-block">
            <div class="entry-head">
              <span class="entry-label">工作 {{ i + 1 }}</span>
              <button class="del-btn" @click="removeWorkEntry(i)">删除</button>
            </div>
            <div class="field-row">
              <div class="field"><label>公司</label><input v-model="w.company" /></div>
              <div class="field"><label>职位</label><input v-model="w.role" /></div>
            </div>
            <div class="field">
              <label>公司Logo</label><input v-model="w.logo" placeholder="url / base64" />
            </div>
            <div class="field-row">
              <div class="field"><label>开始时间</label><input type="month" v-model="w.startDate" /></div>
              <div class="field">
                <label>结束时间</label>
                <div class="date-row">
                  <input type="month" v-model="w.endDate" :disabled="w.isCurrentJob" />
                  <label v-if="!w.endDate || w.isCurrentJob" class="checkbox-label"><input type="checkbox" v-model="w.isCurrentJob" @change="w.endDate = w.isCurrentJob ? currentMonth : ''" /> 至今</label>
                </div>
              </div>
            </div>
            <div class="field-row">
              <div class="field"><label>行业</label><input v-model="w.industry" /></div>
              <div class="field"><label>规模</label>
                <select v-model="w.companySize">
                  <option value="少于50人">少于50人</option>
                  <option value="50-150人">50-150人</option>
                  <option value="150-500人">150-500人</option>
                  <option value="500-1000人">500-1000人</option>
                  <option value="1000-5000人">1000-5000人</option>
                  <option value="5000-10000人">5000-10000人</option>
                  <option value="10000人以上">10000人以上</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>公司性质</label>
              <select v-model="w.companyType">
                <option value="民营">民营</option>
                <option value="国企">国企</option>
                <option value="外企">外企</option>
                <option value="合资">合资</option>
                <option value="事业单位">事业单位</option>
                <option value="上市公司">上市公司</option>
              </select>
            </div>
            <div class="field">
              <label>工作描述</label>
              <textarea v-model="w.description" rows="6"></textarea>
            </div>
          </div>
          <button class="add-btn" @click="addWorkEntry">+ 添加工作经历</button>
        </div>
      </div>

      <!-- 项目经验 -->
      <div class="section" :class="{ open: activeSection === 'projectExperience' }">
        <div class="section-title" @click="toggle('projectExperience')">
          <span>项目经验</span>
          <span class="arrow">›</span>
        </div>
        <div v-show="activeSection === 'projectExperience'" class="section-body">
          <div v-for="(proj, i) in data.projectExperience" :key="proj.id" class="entry-block">
            <div class="entry-head">
              <span class="entry-label">项目 {{ i + 1 }}</span>
              <button class="del-btn" @click="removeProjectEntry(i)">删除</button>
            </div>
            <div class="field">
              <label>项目名称</label><input v-model="proj.name" />
            </div>
            <div class="field-row">
              <div class="field"><label>开始时间</label><input type="month" v-model="proj.startDate" /></div>
              <div class="field">
                <label>结束时间</label>
                <div class="date-row">
                  <input type="month" v-model="proj.endDate" :disabled="proj.isCurrentProject" />
                  <label v-if="!proj.endDate || proj.isCurrentProject" class="checkbox-label"><input type="checkbox" v-model="proj.isCurrentProject" @change="proj.endDate = proj.isCurrentProject ? currentMonth : ''" /> 至今</label>
                </div>
              </div>
            </div>
            <div class="field"><label>所属公司</label>
              <select v-model="proj.company">
                <option value="">无</option>
                <option v-for="w in data.workExperience" :key="w.id" :value="w.company">{{ w.company || '（未填公司名）' }}</option>
              </select>
            </div>
            <div class="field"><label>项目链接</label><input v-model="proj.link" /></div>
            <div class="field">
              <label>项目描述</label>
              <textarea v-model="proj.description" rows="8"></textarea>
            </div>
          </div>
          <button class="add-btn" @click="addProjectEntry">+ 添加项目经历</button>
        </div>
      </div>

      <!-- 教育经历 -->
      <div class="section" :class="{ open: activeSection === 'education' }">
        <div class="section-title" @click="toggle('education')">
          <span>教育经历</span>
          <span class="arrow">›</span>
        </div>
        <div v-show="activeSection === 'education'" class="section-body">
          <div v-for="(edu, i) in data.education" :key="edu.id" class="entry-block">
            <div class="entry-head">
              <span class="entry-label">学历 {{ i + 1 }}</span>
              <button class="del-btn" @click="removeEducationEntry(i)">删除</button>
            </div>
            <div class="field">
              <label>学校</label><input v-model="edu.school" />
            </div>
            <div class="field">
              <label>学校Logo</label><input v-model="edu.logo" placeholder="url / base64" />
            </div>
            <div class="field-row">
              <div class="field"><label>开始时间</label><input type="month" v-model="edu.startDate" /></div>
              <div class="field"><label>结束时间</label><input type="month" v-model="edu.endDate" /></div>
            </div>
            <div class="field-row">
              <div class="field">
                <label>学历</label>
                <select v-model="edu.degree">
                  <option>博士</option><option>硕士</option><option>本科</option>
                  <option>大专</option><option>中专</option><option>高中</option>
                </select>
              </div>
              <div class="field"><label>专业</label><input v-model="edu.major" /></div>
            </div>
          </div>
          <button class="add-btn" @click="addEducationEntry">+ 添加教育经历</button>
        </div>
      </div>

      <!-- 技能特长 -->
      <div class="section" :class="{ open: activeSection === 'skills' }">
        <div class="section-title" @click="toggle('skills')">
          <span>技能特长</span>
          <span class="arrow">›</span>
        </div>
        <div v-show="activeSection === 'skills'" class="section-body">
          <div v-for="(s, i) in data.skills" :key="s.id" class="skill-row">
            <input v-model="s.name" placeholder="技能名称" class="skill-input" />
            <select v-model="s.level" class="skill-select">
              <option v-for="l in skillLevels" :key="l" :value="l">{{ l }}</option>
            </select>
            <button class="del-btn-sm" @click="removeSkillEntry(i)">×</button>
          </div>
          <button class="add-btn" @click="addSkillEntry">+ 添加技能</button>
        </div>
      </div>

      <!-- 个人作品 -->
      <div class="section" :class="{ open: activeSection === 'personalWorks' }">
        <div class="section-title" @click="toggle('personalWorks')">
          <span>个人作品</span>
          <span class="arrow">›</span>
        </div>
        <div v-show="activeSection === 'personalWorks'" class="section-body">
          <div v-for="(w, i) in data.personalWorks" :key="w.id" class="entry-block">
            <div class="entry-head">
              <span class="entry-label">作品 {{ i + 1 }}</span>
              <button class="del-btn" @click="removeWorkEntry2(i)">删除</button>
            </div>
            <div class="field"><label>作品链接</label><input v-model="w.link" placeholder="https://" /></div>
            <div class="field"><label>作品描述</label><input v-model="w.description" /></div>
          </div>
          <button class="add-btn" @click="addWorkEntry2">+ 添加作品</button>
        </div>
      </div>
    </div>

    <div class="editor-footer">
      <span>v1.1.0</span>
      <span class="dot">·</span>
      <a href="https://github.com/xinboo/resume-app" target="_blank">GitHub</a>
      <span class="dot">·</span>
      <a href="#" @click.prevent="showDonate = true">打赏</a>
    </div>

    <div v-if="showDonate" class="donate-overlay" @click="showDonate = false">
      <div class="donate-modal" @click.stop>
        <div class="donate-title">请支持一杯咖啡，感谢</div>
        <div class="donate-qr-row">
          <div class="donate-qr-item">
            <div class="donate-qr"><img src="/wechat-qr.jpg" alt="微信" /></div>
            <div class="donate-label">微信</div>
          </div>
          <div class="donate-qr-item">
            <div class="donate-qr"><img src="/alipay-qr.jpg" alt="支付宝" /></div>
            <div class="donate-label">支付宝</div>
          </div>
        </div>
        <div class="donate-hint">感谢你的支持 :)</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 8%;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.editor-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-link {
  font-size: 14px;
  color: #3498db;
  text-decoration: none;
  cursor: pointer;
}

.preview-link:hover {
  text-decoration: underline;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-btn {
  padding: 4px 16px;
  font-size: 14px;
  color: #fff;
  background: #3498db;
  border: 1px solid #3498db;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:hover:not(.disabled) {
  background: #2980b9;
}

.save-btn.disabled {
  background: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

.menu-wrapper {
  position: relative;
}

.menu-btn {
  padding: 4px 12px;
  font-size: 14px;
  color: #3498db;
  background: #fff;
  border: 1px solid #3498db;
  border-radius: 4px;
  cursor: pointer;
}

.menu-btn:hover {
  background: #f0f7fd;
}

.menu-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  min-width: 120px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 100;
  overflow: hidden;
}

.menu-item {
  padding: 8px 16px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
}

.menu-item:hover {
  background: #f0f7fd;
  color: #3498db;
}

.menu-item-danger { color: #e74c3c; }
.menu-item-danger:hover { background: #fdf0ef; color: #e74c3c; }


.sections {
  flex: 1;
  overflow-y: auto;
}

.section {
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8%;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  user-select: none;
  transition: background 0.15s;
}

.section-title:hover {
  background: #f8f9fa;
}

.arrow {
  font-size: 16px;
  color: #999;
  transition: transform 0.2s;
}

.section.open .arrow {
  transform: rotate(90deg);
}

.section-body {
  padding: 0 8% 16px;
}

.field {
  margin-bottom: 10px;
}

.field label {
  display: block;
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 6px 10px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #333;
  background: #fff;
  font-family: inherit;
  box-sizing: border-box;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52,152,219,0.12);
}

.date-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-row input[type="month"] {
  flex: 1;
  cursor: pointer;
}

input[type="month"]::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

input[type="month"] {
  position: relative;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #555;
  white-space: nowrap;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.field textarea {
  resize: vertical;
  min-height: 120px;
}

.field textarea.auto-height {
  field-sizing: content;
  min-height: 200px;
  padding-bottom: 80px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.entry-block {
  padding: 12px;
  margin-bottom: 10px;
  background: #fafbfc;
  border: 1px solid #eee;
  border-radius: 6px;
}

.entry-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.entry-label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.del-btn {
  padding: 2px 8px;
  font-size: 12px;
  color: #e74c3c;
  background: #fff;
  border: 1px solid #e74c3c;
  border-radius: 3px;
  cursor: pointer;
}

.del-btn:hover {
  background: #fdf0ef;
}

.add-btn {
  width: 100%;
  padding: 8px;
  font-size: 13px;
  color: #666;
  background: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.add-btn:hover {
  background: #eee;
  color: #333;
}

.skill-row {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 6px;
}

.skill-input {
  flex: 1;
  padding: 6px 10px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #333;
  background: #fff;
  font-family: inherit;
}

.skill-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52,152,219,0.12);
}

.skill-select {
  width: 72px;
  padding: 6px 4px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #333;
  background: #fff;
  font-family: inherit;
}

.skill-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52,152,219,0.12);
}

.del-btn-sm {
  width: 24px;
  height: 24px;
  font-size: 16px;
  line-height: 1;
  color: #ccc;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  flex-shrink: 0;
}

.del-btn-sm:hover {
  color: #e74c3c;
  background: #fdf0ef;
}

.editor-footer {
  padding: 10px 8%;
  text-align: center;
  font-size: 12px;
  color: #bbb;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.editor-footer .dot {
  margin: 0 6px;
}

.editor-footer a {
  color: #999;
  text-decoration: none;
}

.editor-footer a:hover {
  color: #3498db;
}

.donate-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.donate-modal {
  background: #fff;
  border-radius: 10px;
  padding: 28px 36px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.donate-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.donate-qr-row {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 12px;
}

.donate-qr-item {
  text-align: center;
}

.donate-qr {
  width: 220px;
  height: 220px;
  background: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.donate-qr img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.donate-label {
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}

.donate-hint {
  font-size: 13px;
  color: #999;
}
</style>
