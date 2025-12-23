<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { sidebarStateStorage } from '@/utils/instances'
defineOptions({
  name: 'AppSidebar',
})
const isCollapsed = ref(true)
const menus = [
  {
    title: 'Tin tuyển dụng',
    icon: 'icon-sb-recruiment',
    href: '#',
    active: false,
  },
  {
    title: 'Ứng viên',
    icon: 'icon-sb-candidate-active',
    href: '#',
    active: true,
  },
  {
    title: 'Lịch',
    icon: 'icon-sb-calendar',
    href: '#',
    active: false,
  },
  {
    title: 'Kho tiềm năng',
    icon: 'icon-sb-talent-pools',
    href: '#',
    active: false,
  },
  {
    title: 'Chiến dịch tuyển dụng',
    icon: 'icon-sb-recruitment-campaign-active',
    href: '#',
    active: false,
  },
  {
    title: 'Công việc',
    icon: 'icon-sb-task',
    href: '#',
    active: false,
  },
  {
    title: 'aiMarketing',
    icon: 'icon-email-ai-marketing',
    href: '#',
    active: false,
  },
  {
    title: 'Trao đổi với ứng viên',
    icon: 'icon-chat-box',
    href: '#',
    active: false,
  },
  {
    title: 'Báo cáo',
    icon: 'icon-sb-report',
    href: '#',
    active: false,
  },
  {
    title: 'Thiết lập',
    icon: 'icon-sb-setting',
    href: '#',
    active: false,
  },
  {
    title: 'Kiến thức hữu ích',
    icon: 'icon-knowledge-trigger icon-base-24',
    href: '#',
    active: false,
  },
]
onBeforeMount(() => {
  const sidebarState = sidebarStateStorage.get(false)
  isCollapsed.value = sidebarState === '1'
})
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': isCollapsed }">
    <nav class="sidebar__nav">
      <ul class="sidebar__menu">
        <li
          v-for="(menu, index) in menus"
          :key="index"
          class="sidebar__menu-item"
          :class="{ 'sidebar__menu-item--active': menu.active }"
        >
          <a :href="menu.href" class="sidebar__menu-link">
            <span
              :class="[
                // item cuối đang dùng icon-base-24 thay vì icon-default
                menu.icon.includes('icon-knowledge-trigger') ? '' : 'icon-default',
                menu.icon,
              ]"
            ></span>
            <span class="sidebar__menu-text ml-3">{{ menu.title }}</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="sidebar__footer">
      <button
        class="sidebar__collapse-btn gap-2 flex justify-start items-center"
        @click="
          () => {
            isCollapsed = !isCollapsed
            sidebarStateStorage.set(isCollapsed ? '1' : '0')
          }
        "
      >
        <span class="icon-default icon-left"></span>
        <span class="sidebar__collapse-text ml-3">Thu gọn</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
/* Sidebar */
.sidebar {
  width: 233px;
  background-color: #2d3748;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-image: url(https://amisplatform.misacdn.net/apps/recruit/event-sidebar.86fc6daf7938e471.svg);
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom;
  background-color: #051529;
}

.sidebar--collapsed {
  width: 72px;
}

.sidebar--collapsed .sidebar__collapse-btn {
  justify-content: center;
}

.sidebar--collapsed .sidebar__menu-link {
  justify-content: center;
}

.sidebar--collapsed .sidebar__menu-text,
.sidebar--collapsed .sidebar__collapse-text {
  display: none;
}

.sidebar--collapsed .sidebar__collapse-btn .icon-left {
  transform: rotate(180deg);
}

.sidebar__header {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar__title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.sidebar__banner {
  height: 80px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  /* Placeholder for banner image */
}

.sidebar__nav {
  flex: 1;
  padding: 32px 0 16px 0;
  overflow-y: scroll;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.sidebar__menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar__menu-link {
  display: flex;
  align-items: center;
  color: #e2e8f0;
  text-decoration: none;
  transition: background-color 0.2s;
  cursor: pointer;
  padding: 8px 11px;
  margin: 12px;
  margin-top: unset;
  border-radius: 4px;
}

.sidebar__menu-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar__menu-item--active .sidebar__menu-link {
  background-color: #2680eb;
  color: #fff;
}

.sidebar__menu-icon {
  width: 20px;
  margin-right: 12px;
  font-size: 16px;
}

.sidebar__menu-text {
  font-size: 14px;
  font-weight: 600;
}

.sidebar__footer {
  background: rgba(0, 0, 0, 0.3);
  padding: 0 12px;
  padding-bottom: 16px;
}

.sidebar__collapse-btn {
  width: 100%;
  padding: 8px;
  background-color: transparent;
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar__collapse-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar__collapse-icon {
  margin-right: 8px;
}
</style>
