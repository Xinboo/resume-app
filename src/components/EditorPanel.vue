<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ResumeData, SkillLevel } from '../types/resume'

const props = defineProps<{ data: ResumeData }>()
const emit = defineEmits<{ save: [] }>()

const activeSection = ref<string | null>(null)
const isDirty = ref(false)

watch(() => props.data, () => { isDirty.value = true }, { deep: true })

function handleSave() {
  emit('save')
  isDirty.value = false
}

const skillLevels: SkillLevel[] = ['精通', '熟练', '良好', '一般']

function toggle(section: string) {
  activeSection.value = activeSection.value === section ? null : section
}

function addWorkEntry() {
  props.data.workExperience.push({
    id: crypto.randomUUID(), logo: '', company: '', duration: '', period: '',
    role: '', industry: '', companySize: '', companyType: '', description: '',
  })
}

function removeWorkEntry(i: number) {
  props.data.workExperience.splice(i, 1)
}

function addProjectEntry() {
  props.data.projectExperience.push({
    id: crypto.randomUUID(), name: '', period: '', company: '', description: '',
  })
}

function removeProjectEntry(i: number) {
  props.data.projectExperience.splice(i, 1)
}

function addEducationEntry() {
  props.data.education.push({
    id: crypto.randomUUID(), school: '', period: '', degree: '本科', major: '',
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
</script>

<template>
  <div class="editor-panel">
    <div class="editor-header">
      <h2>简历编辑</h2>
      <button class="save-btn" :class="{ disabled: !isDirty }" :disabled="!isDirty" @click="handleSave">保存</button>
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
              <label>到岗时间</label>
              <input v-model="data.jobIntention.availability" />
            </div>
          </div>
          <div class="field">
            <label>求职状态</label>
            <input v-model="data.jobIntention.jobStatus" />
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
              <label>公司Logo</label><input v-model="w.logo" placeholder="图片URL" />
            </div>
            <div class="field-row">
              <div class="field"><label>时间段</label><input v-model="w.period" placeholder="2021/6-至今" /></div>
              <div class="field"><label>时长</label><input v-model="w.duration" placeholder="3年9个月" /></div>
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
            <div class="field-row">
              <div class="field"><label>项目名称</label><input v-model="proj.name" /></div>
              <div class="field"><label>时间段</label><input v-model="proj.period" /></div>
            </div>
            <div class="field"><label>所属公司</label><input v-model="proj.company" /></div>
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
            <div class="field-row">
              <div class="field"><label>学校</label><input v-model="edu.school" /></div>
              <div class="field"><label>时间段</label><input v-model="edu.period" /></div>
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
            <div class="field"><label>链接</label><input v-model="w.link" placeholder="https://" /></div>
            <div class="field"><label>描述</label><input v-model="w.description" /></div>
          </div>
          <button class="add-btn" @click="addWorkEntry2">+ 添加作品</button>
        </div>
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
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.editor-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.save-btn {
  padding: 4px 16px;
  font-size: 12px;
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
  padding: 12px 20px;
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
  padding: 5px 8px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.skill-input:focus {
  outline: none;
  border-color: #3498db;
}

.skill-select {
  width: 72px;
  padding: 5px 4px;
  font-size: 13px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
</style>
