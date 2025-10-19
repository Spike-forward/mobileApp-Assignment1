// 從 JavaScript 模組匯入課程資料和函數
import { courses, searchCourses, getAllCategories } from './courseData.js';

// 全域變數
let filteredCourses = [...courses];
let currentCategory = '';

// DOM 元素
const courseList = document.getElementById('courseList');
const searchBar = document.querySelector('ion-searchbar');
const categorySelect = document.querySelector('ion-select');
const noResults = document.getElementById('noResults');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  updateCourseList();
  setupEventListeners();
  populateCategoryOptions();
});

// 設定事件監聽器
function setupEventListeners() {
  // 搜尋功能
  searchBar.addEventListener('ionInput', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    filterCourses(searchTerm, currentCategory);
  });

  // 分類篩選
  categorySelect.addEventListener('ionChange', function(event) {
    currentCategory = event.detail.value;
    const searchTerm = searchBar.value.toLowerCase();
    filterCourses(searchTerm, currentCategory);
  });
}

// 填充分類選項
function populateCategoryOptions() {
  const categories = getAllCategories();
  const categoryOptions = document.querySelectorAll('ion-select-option');
  
  // 清除現有選項（除了"全部課程"）
  categoryOptions.forEach((option, index) => {
    if (index > 0) {
      option.remove();
    }
  });

  // 添加新的分類選項
  categories.forEach(category => {
    const option = document.createElement('ion-select-option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// 篩選課程
function filterCourses(searchTerm, category) {
  filteredCourses = searchCourses(searchTerm, category);
  updateCourseList();
}

// 更新課程清單顯示
function updateCourseList() {
  courseList.innerHTML = '';
  
  if (filteredCourses.length === 0) {
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  filteredCourses.forEach(course => {
    const courseItem = createCourseItem(course);
    courseList.appendChild(courseItem);
  });
}

// 建立課程項目元素
function createCourseItem(course) {
  const item = document.createElement('ion-item');
  item.className = 'course-item';
  item.button = false;

  const levelClass = course.level === '進階' ? 'advanced' : 
                    course.level === '中級' ? 'intermediate' : '';

  item.innerHTML = `
    <div class="item-content">
      <div class="course-header" data-course-id="${course.title}">
        <div>
          <div class="item-title">${course.title}</div>
          <div class="item-subtitle">${course.language}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <ion-badge class="level-badge ${levelClass}">
            ${course.level}
          </ion-badge>
          <ion-icon name="chevron-down" class="expand-icon"></ion-icon>
        </div>
      </div>
      
      <div class="course-details" id="details-${course.title.replace(/\s+/g, '-')}">
        <div class="course-description">
          <h4 style="margin: 0 0 0.5rem 0; color: var(--ion-color-primary);">課程重點</h4>
          <p style="margin: 0;">${course.details}</p>
        </div>
        
        <div class="course-tags">
          <ion-chip class="category-chip" size="small">${course.category}</ion-chip>
          ${course.tags.map(tag => `<ion-chip class="language-chip" size="small">${tag}</ion-chip>`).join('')}
        </div>
        
        <div class="course-media">
          <img src="${course.imageUrl}" alt="${course.title}" class="course-image" loading="lazy">
          <div class="video-container">
            <iframe 
              src="${course.videoUrl}" 
              title="${course.title} 教學影片"
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
        </div>
      </div>
    </div>
  `;

  return item;
}

// 點擊事件處理
document.addEventListener('click', function(event) {
  // 點擊分類標籤快速篩選
  if (event.target.classList.contains('category-chip')) {
    const category = event.target.textContent;
    categorySelect.value = category;
    currentCategory = category;
    const searchTerm = searchBar.value.toLowerCase();
    filterCourses(searchTerm, category);
  }
  
  // 點擊課程標題展開/收合詳細資訊
  if (event.target.closest('.course-header')) {
    const courseHeader = event.target.closest('.course-header');
    const courseId = courseHeader.getAttribute('data-course-id');
    const courseItem = courseHeader.closest('.course-item');
    const courseDetails = courseItem.querySelector('.course-details');
    const expandIcon = courseHeader.querySelector('.expand-icon');
    
    // 切換展開狀態
    if (courseDetails.classList.contains('expanded')) {
      // 收合
      courseDetails.classList.remove('expanded');
      courseItem.classList.remove('expanded');
      expandIcon.classList.remove('expanded');
    } else {
      // 展開
      courseDetails.classList.add('expanded');
      courseItem.classList.add('expanded');
      expandIcon.classList.add('expanded');
    }
  }
});
